import { Router } from "express";
import { check } from "express-validator";

import {
  fieldsValidation,
  UploadFilesValidation,
} from "../middlewares/index.js";
import { uploadFile, updateImage, getImages, updateImageCloudinary } from "../controllers/uploads.controller.js";
import { allowedCollections } from "../helpers/db-validators.js";

const uploads_router = Router();

uploads_router.post("/", UploadFilesValidation, uploadFile);

uploads_router.put(
  "/:collection/:id",
  [
    UploadFilesValidation,
    check("id", "No es un ID de Mongo válido").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    fieldsValidation,
  ],
  updateImageCloudinary
//   updateImage
);

uploads_router.get("/:collection/:id", [
  check("id", "No es un ID de Mongo válido").isMongoId(),
  check("collection").custom((c) => allowedCollections(c, ["users", "products"])),
  fieldsValidation,
], getImages);

export default uploads_router;
