require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { MongoClient } = require("mongodb");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
});

let db = null;

async function connectDB() {
  try {
    console.log("Connecting to MongoDB...");

    await client.connect();

    console.log("Mongo Client Connected");

    db = client.db("make3dspace");

    console.log("MongoDB Connected");

  } catch (err) {
    console.error("Mongo Error FULL:");
    console.error(err);

    db = null;
  }
 }
 console.log("URI EXISTS:", !!process.env.MONGODB_URI);
console.log("URI:", process.env.MONGODB_URI?.substring(0, 30));
connectDB();

app.use(cors());
app.use(express.json());

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("Uploaded:", req.file.filename);

    try {
      if (db) {
        await db.collection("uploads").insertOne({
          filename: req.file.filename,
          uploadedAt: new Date(),
        });

        console.log("Saved to MongoDB");
      } else {
        console.log("MongoDB not connected, skipping save");
      }
    } catch (mongoError) {
      console.error("Mongo Save Error:", mongoError);
    }

    return res.json({
      success: true,
      filename: req.file.filename,
      url: `http://localhost:5000/uploads/${req.file.filename}`,
    });

  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/generate", (req, res) => {
  res.json({
    success: true,
    message: "Generate route working",
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { filename } = req.body;

    console.log("Generating scene for:", filename);

    const imagePath = path.join(
      __dirname,
      "../uploads",
      filename
    );

    console.log("Image Path:", imagePath);

    const imageBuffer = fs.readFileSync(imagePath);

   console.log("========== GENERATE START ==========");
console.log("USING MODEL: gemini-2.5-flash");
console.log("FILENAME:", filename);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent([
      `
Analyze this image and create a simple 3D reconstruction layout.

Return ONLY valid JSON.

{
  "objectType": "",
  "environmentType": "",
  "blocks": [
    {
      "x": 0,
      "z": 0,
      "w": 120,
      "d": 120,
      "h": 200
    }
  ]
}

Rules:
- JSON only
- No markdown
- No explanation
- blocks must contain 3 to 10 objects
- x and z are positions
- w = width
- d = depth
- h = height
- Estimate building structure from image
Rules:
- JSON only
- No markdown
- No explanation
`,
      {
        inlineData: {
          mimeType: "image/png",
          data: imageBuffer.toString("base64"),
        },
      },
    ]);

    const text = result.response.text();

    console.log("GEMINI RESPONSE:");
    console.log(text);

    res.json({
      success: true,
      ai: text,
    });

  } catch (error) {
    console.error("Generate Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});