import axios from "axios";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as fsExtra from "fs-extra";
import mime from "mime-types";
import { pet_details_schema } from "../models/pet_details.js";
import { validationResult } from "express-validator";
import { } from "dotenv/config";
import he from "he"

const localhost = process.env.LOCAL_HOST;
const flask_port = process.env.FLASK_PORT || 5000;
const isDocker = process.env.DOCKER_ENV === "true";
const flaskHost = isDocker
  ? `http://${process.env.FLASK_HOST}:${flask_port}`
  : `http://${localhost}:${flask_port}`;

const uploadDir = isDocker ? "/backend-app/pets" : path.join(__dirname, "pets");

const newPet_model = mongoose.model("newPet", pet_details_schema);
const maxSize = 1 * 1024 * 1024; //1MB

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if we're inside Docker
    console.log("Uploading to:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log("Received file:", file.originalname);  // Log incoming file
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    // Reject the file
    cb(new Error("Invalid file type. Please upload a JPEG or PNG image."));
  } else {
    // Accept the file
    cb(null, true);
  }
};

const limits = { fileSize: maxSize };

const uploadFile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
}).single("file");

export const handlePetImage = async (req, res) => {
  console.log("Upload");
  fsExtra.emptyDirSync("pets");
  try {
    uploadFile(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          console.error("Multer error:", err.message);
          return res.status(400).json({ error: "File upload failed due to Multer restrictions." });
        } else {
          console.error("Unknown error during file upload:", err);
          return res.status(500).json({ error: "Internal server error during file upload." });
        }
      }

      if (!req.file) {
        console.error("No file uploaded");
        return res.status(400).json({ error: "No file was uploaded." });
      }

      try {
        const response = await axios.get(
          `${flaskHost}/flask/pets_details?name=${req.file.originalname}`,
          {
            responseType: "json",
          }
        );
        return res.json(response.data);
      } catch (axiosError) {
        console.error("Axios request failed:", axiosError.message);
        return res.status(500).json({ error: "Failed to fetch pet details." });
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const handlePetDetails = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Validation errors
    return res.status(400).json({ errors: errors.array() });
  }

  const petBreeds = he.decode(req.body.petBreeds);
  const { userEmail, petName, petType, petGender, location, status, note } = req.body;

  // get photo file name
  const directoryPath = isDocker ? "/backend-app/pets" : "pets";
  let filenames = [];
  let fileName = "";

  if (fs.existsSync(directoryPath)) {
    filenames = fs.readdirSync(directoryPath);
    fileName = filenames[0];
  } else {
    console.error("Directory does not exist");
    return res.status(400).json({ error: "Pets directory not found" });
  }

  if (!fileName) {
    return res.status(400).json({ error: "No pet image found" });
  }

  const imagePath = `${directoryPath}/${fileName}`;
  const contentType = mime.lookup(path.extname(imagePath)) || "application/octet-stream";

  let imgData = null;
  try {
    imgData = fs.readFileSync(imagePath);
  } catch (err) {
    return res.status(500).json({ error: "Error reading pet image" });
  }

  let obj = {
    petName,
    petType,
    petGender,
    petBreeds,
    location,
    img: { data: imgData, contentType },
    note,
    status,
    userEmail,
  };

  try {
    const newPet = new newPet_model(obj);
    let result = await newPet.save();
    let documentID = result._id.valueOf();

    const response = await axios.get(
      `${flaskHost}/flask/imageSimilarity?petType=${petType}&docID=${documentID}&status=${status}`,
      { responseType: "json" }
    );

    // We got an array of docs IDs, so we need to retreive each one.
    // In order to achieve that, the most efficient way is by using the Promise.all func (because retreiving a doc returns a promise)
    // the method returns a single promise
    // at the the end we get an array of docs

    if (!response.data || !Array.isArray(response.data)) {
      return res.status(500).json({ error: "Invalid response from Flask" });
    }

    const docPromises = response.data.map(async (docId) => {
      if (!docId) return "Invalid document ID";
      const doc = await newPet_model.findById(docId);
      return doc || "Document not found";
    });

    const docs_arr = await Promise.all(docPromises);
    res.json(docs_arr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const handleFinderOfTheMonth = async (req, res) => {
  try {
    const filter = [
      {
        $match: {
          status: "found",
        },
      },
      {
        $group: {
          _id: "$userEmail",
          foundPetsCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          foundPetsCount: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          userEmail: "$_id",
          foundPetsCount: 1,
          _id: 0
        }
      }
    ];

    const result = await newPet_model.aggregate(filter);
    if (result.length > 0) {
      let userName = result[0].userEmail.split('@')[0];
      result[0].userName = userName;
      res.json(result[0]);
    } else {
      res.json({ message: "אף משתשמש לא מצא חיות" });
    }
  } catch (err) {
    res.json(err.message);
  }
};