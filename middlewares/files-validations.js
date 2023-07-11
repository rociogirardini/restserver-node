import { response } from "express";

const UploadFilesValidation = (req, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    res.status(400).json({
      msg: "No hay archivos que subir. | files",
    });
    return;
  }
  next();
};

export { UploadFilesValidation };
