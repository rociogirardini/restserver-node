import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { v4 as uuidv4 } from "uuid";

const uploadFiles = ( files, allowedExtensions = ["png", "jpg", "jpeg", "gif"], folder = "") => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const croppedName = file.name.split(".");
    const extension = croppedName[croppedName.length - 1];

    // Validar la extensión
    if (!allowedExtensions.includes(extension)) {
      return reject(
        `La extensión ${extension} no está permitida. Solo ${allowedExtensions}`
      );
    }

    const temporalFileName = uuidv4() + "." + extension;
    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      folder,
      temporalFileName
    );

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }
      resolve(temporalFileName);
    });
  });
};

export default uploadFiles;
