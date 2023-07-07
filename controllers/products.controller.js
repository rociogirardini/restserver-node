import { response } from "express";
import { Product } from "../models/index.js";

// Obtener Productos | Paginado | Total | Populate

const getAllProducts = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const q = { status: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(q),
    Product.find(q)
      .populate("user", "name")
      .populate("category", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    products,
  });
};

// Obtener Producto por id | Populate

const getProduct = async (req, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  res.json(product);
};

// Crear producto

const createProduct = async (req, res = response) => {
  const { state, user, ...body } = req.body;
  const name = body.name;

  // Revisar que no exista el producto

  const productDB = await Product.findOne({ name });

  if (productDB) {
    return res.status(400).json({
      msg: `El producto ${productDB.name} ya existe.`,
    });
  }

  // Generar la data a guardar

  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.user._id,
    // category: req.body.category
  };

  const product = new Product(data);

  // Guardar en la DB

  await product.save();

  res.status(201).json(product);
};

// Actualizar producto

const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }

  data.user = req.user._id;
  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.json(product);
};

// Borrar producto | Status: false

const deleteProduct = async (req, res = response) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json(deletedProduct);
};

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
