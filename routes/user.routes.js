import { Router } from "express";
import { check } from "express-validator";
import fieldsValidation from "../middlewares/fields-validations.js";
import { roleIsValid, emailExist, userExist } from "../helpers/db-validators.js";

import {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [
    check("email", "El correo no es válido.").isEmail(),
    check("password", "La contraseña debe contener más de 6 caracteres.").isLength({ min: 6 }),
    check("name", "El nombre es obligatorio.").not().isEmpty(),
    check("role").custom(roleIsValid),
    check("email").custom(emailExist),
    fieldsValidation,
  ], postUsers);

router.put("/:id",[
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(userExist),
  check("role").custom(roleIsValid),
  fieldsValidation,
],putUsers);

router.patch("/", patchUsers);

router.delete("/:id",[
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(userExist),
  fieldsValidation
] ,deleteUsers);

export default router;
