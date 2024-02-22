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

const newPet_model = mongoose.model("newPet", pet_details_schema);
const maxSize = 1 * 1024 * 1024; //1MB

const storage = multer.diskStorage({
  destination: "pets",
  filename: (req, file, cb) => {
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
      if (err instanceof multer.MulterError) {
        // some multer error occured
        console.log({ error: "File upload failed." });
        return res.send({ error: "File upload failed." });
      } else if (err) {
        // err contains something, it is not 'undefined', so some unknown
        // (non multer) error occurred when uploading            
        console.log({ error: "Internal server error." });
        return res.send({ error: "Internal server error." });
      }

      if (!req.file) {
        // No file was uploaded
        console.log({ error: "No file was uploaded." });
        return res.send({ error: "No file was uploaded." });
      }

      try {
        const response = await axios.get(
          `http://${localhost}${flask_port}/flask/pets_details?name=${req.file.originalname}`,
          {
            responseType: "json",
          }
        );
        res.json(response.data);
      } catch (err) {
        res.sendStatus(500).json(err.message);
      }
    });
  } catch (err) {
    res.sendStatus(500).json(err.message);
  }
};

export const handlePetDetails = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Validation errors
    return res.status(400).json({ errors: errors.array() });
  }

  const petBreeds = he.decode(req.body.petBreeds);
  const {
    userEmail,
    petName,
    petType,
    petGender,
    location,
    status,
    note,
  } = req.body

  // get photo file name
  const directoryPath = "pets";
  let filenames = [];
  let fileName = "";
  if (fs.existsSync(directoryPath)) {
    filenames = fs.readdirSync(directoryPath);
    fileName = filenames[0];
  } else {
    console.log("Directory does not exist");
  }

  const imagePath = `${directoryPath}/${fileName}`;
  const contentType = mime.lookup(path.extname(imagePath));

  let obj = {
    petName: petName,
    petType: petType,
    petGender: petGender,
    petBreeds: petBreeds,
    location: location,
    img: {
      data: fs.readFileSync(`pets/${fileName}`),
      contentType: contentType,
    },
    note: note,
    status: status,
    userEmail: userEmail,
  };

  const newPet = new newPet_model(obj);
  let result = await newPet.save();
  // extract the document id
  let documentID = result._id.valueOf();

  // Handle the data:
  try {
    // flask
    const response = await axios.get(
      `http://${localhost}${flask_port}/flask/imageSimilarity?petType=${petType}&docID=${documentID}&status=${status}`,
      {
        responseType: "json",
      }
    );
    // We got an array of docs IDs, so we need to retreive each one.
    // In order to achieve that, the most efficient way is by using the Promise.all func (because retreiving a doc returns a promise)
    // the method returns a single promise
    // at the the end we get an array of docs
    try {
      const docPromises = response.data.map(async (docId) => {
        const doc = await newPet_model.findById(docId);
        return doc ? doc : "Document not found";
      });
      const docs_arr = await Promise.all(docPromises);
      res.json(docs_arr);
    } catch (err) {
      res.json(err.message);
    }
  } catch (err) {
    res.json(err.message);
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