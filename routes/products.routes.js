import { Router } from "express";
import { check } from "express-validator";

import {
  fieldsValidation,
  isAdminRole,
  jwtValidation,
} from "../middlewares/index.js";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { productExist, categoryExist } from "../helpers/db-validators.js";

const product_router = Router();

// Obtener todos los productos | path público
product_router.get("/", getAllProducts);

// Obtener un producto por id | path público
product_router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(productExist),
    fieldsValidation,
  ],
  getProduct
);

// Crear producto | path privado — cualquier persona con un token válido
product_router.post(
  "/",
  [
    jwtValidation,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("category", "No es un id de Mongo válido").isMongoId(),
    check("category").custom(categoryExist),
    fieldsValidation,
  ],
  createProduct
);

// Actualizar un registro por id | path privado — cualquier persona con un token válido
product_router.put(
  "/:id",
  [
    jwtValidation,
    check("category", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(productExist),
    fieldsValidation,
  ],
  updateProduct
);

// Borrar producto | Solo acceso desde role ADMIN

product_router.delete(
  "/:id",
  [
    jwtValidation,
    isAdminRole,
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(productExist),
    fieldsValidation,
  ],
  deleteProduct
);

export default product_router;
