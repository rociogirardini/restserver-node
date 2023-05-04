import { Router } from "express";
import { check } from "express-validator";
import { fieldsValidation, jwtValidation, isAdminRole, hasRole} from '../middlewares/index.js'
import { roleIsValid, emailExist, userExist } from "../helpers/db-validators.js";

import {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
} from "../controllers/user.controller.js";

const user_router = Router();

user_router.get("/", getUsers);

user_router.post(
  "/",
  [
    check("email", "El correo no es válido.").isEmail(),
    check("password", "La contraseña debe contener más de 6 caracteres.").isLength({ min: 6 }),
    check("name", "El nombre es obligatorio.").not().isEmpty(),
    check("role").custom(roleIsValid),
    check("email").custom(emailExist),
    fieldsValidation,
  ], postUsers);

user_router.put("/:id",[
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(userExist),
  check("role").custom(roleIsValid),
  fieldsValidation,
],putUsers);

user_router.patch("/", patchUsers);

user_router.delete("/:id",[
  jwtValidation,
  // isAdminRole,
  hasRole('ADMIN_ROLE', 'SAILS_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(userExist),
  fieldsValidation
] ,deleteUsers);

export default user_router;
