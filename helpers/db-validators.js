import { Category, Product } from "../models/index.js";
import Role from "../models/role.js";
import User from "../models/user.js";

const roleIsValid = async (role = "") => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`El rol ${role} no es válido.`);
  }
};

const emailExist = async (email = "") => {
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new Error(`El email ${email} ya está registrado.`);
  }
};

const userExist = async (id) => {
  const userExists = await User.findById(id);
  if (!userExists) {
    throw new Error(`El ID ${id} no existe.`);
  }
};

const categoryExist = async (id) => {
  const categoryExists = await Category.findById(id);
  if (!categoryExists) {
    throw new Error(`La categoría no existe.`);
  }
};

const productExist = async (id) => {
  const productExists = await Product.findById(id);
  if (!productExists) {
    throw new Error("El producto no existe.");
  }
};

const allowedCollections = async (collection = "", collections = []) => {
  const include = collections.includes(collection);
  if (!include) {
    throw new Error(
      `La colección ${collection} no está permitida. Colecciones permitidas: ${collections}`
    );
  }
  return true;
};

export {
  allowedCollections,
  categoryExist,
  emailExist,
  productExist,
  roleIsValid,
  userExist,
};
