import { Router } from "express";
import { check } from "express-validator";

import { fieldsValidation, isAdminRole, jwtValidation } from "../middlewares/index.js";
import {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";
import { categoryExist } from "../helpers/db-validators.js";

const categ_router = Router();

// Obtener todas las categorias | path público
categ_router.get("/", getAllCategories);

// Obtener una categoria por id | path público
categ_router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(categoryExist),
    fieldsValidation,
  ],
  getCategory
);

// Crear categoría | path privado — cualquier persona con un token válido
categ_router.post(
  "/",
  [
    jwtValidation,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    fieldsValidation,
  ],
  createCategory
);

// Actualizar un registro por id | path privado — cualquier persona con un token válido
categ_router.put("/:id", [
    jwtValidation,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(categoryExist),
    fieldsValidation
],updateCategory);

// Borrar categoría | Solo acceso desde role ADMIN
categ_router.delete("/:id", [
    jwtValidation,
    isAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(categoryExist),
    fieldsValidation
], deleteCategory);

export default categ_router;
