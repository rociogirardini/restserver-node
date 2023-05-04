import { Router } from "express";
import { check } from "express-validator";

import { login, googleSignIn } from "../controllers/auth.controller.js";
import { fieldsValidation } from "../middlewares/index.js";

const auth_router = Router();

auth_router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    fieldsValidation,
  ],
  login
);

auth_router.post(
  "/google",
  [
    check("id_token", "El token de Google es necesario").not().isEmpty(),
    fieldsValidation,
  ],
  googleSignIn
);

export default auth_router;
