import { response } from "express";
import uploadFiles from "../helpers/upload-files.js";
import { Product, User } from "../models/index.js";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import * as dotenv from "dotenv";
dotenv.config();

import * as Cloudinary from "cloudinary";
Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (req, res = response) => {
  try {
    const name = await uploadFiles(req.files, undefined, "images");
    res.json({
      name,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

const updateImage = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Caso no validado." });
  }

  // Limpiar imágenes previas

  if (model.img) {
    // Borrar la imagen del servidor
    const imgPath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  }

  const name = await uploadFiles(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json(model);
};

const getImages = async (req, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Caso no validado." });
  }

  // Limpiar imágenes previas

  let imgPath;
  if (model.img) {
    // Borrar la imagen del servidor
    imgPath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imgPath)) {
      return res.sendFile(imgPath);
    }
  }

  imgPath = path.join(__dirname, "../assets/no-image.jpg");

  res.sendFile(imgPath);
};

const updateImageCloudinary = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Caso no validado." });
  }

  // Limpiar imágenes previas

  const { tempFilePath } = req.files.file;
  if (model.img) {
    const nameArr = model.img.split("/");
    const name = nameArr[nameArr.length - 1];
    const [ public_id ] = name.split(".");
    await Cloudinary.uploader.destroy(public_id);
  }
  const { secure_url } = await Cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;

  // const name = await uploadFiles(req.files, undefined, collection);
  // model.img = name;

  await model.save();

  res.json(model);
};

export { uploadFile, updateImage, getImages, updateImageCloudinary };
