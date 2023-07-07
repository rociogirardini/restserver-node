import { response } from "express";
import { Category } from "../models/index.js";

// Obtener Categorías | Paginado | Total | Populate

const getAllCategories = async (req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const q = { status: true };
  
    const [total, categories] = await Promise.all([
      Category.countDocuments(q),
      Category.find(q)
        .populate('user', 'name')
        .skip(Number(from))
        .limit(Number(limit)),
    ]);
  
    res.json({
      total,
      categories,
    });
};

// Obtener Categoría | Populate

const getCategory = async (req, res = response) => {

  const { id } = req.params;
  const category = await Category.findById(id).populate('user', 'name');

  res.json(category)

};

// Crear categoría

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();

  // Revisar que no exista la categoría

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `La categoría ${categoryDB.name} ya existe.`,
    });
  }

  // Generar la data a guardar

  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);

  // Guardar en la DB

  await category.save();

  res.status(201).json(category);
};

// Actualizar categoría

const updateCategory = async( req, res = response) => {

  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, data, {new: true});

  res.json(category)

}

// Borrar categoría | Status: false

const deleteCategory = async (req, res = response) => {

  const { id } = req.params;
  const delatedCategory = await Category.findByIdAndUpdate(id, {status: false}, {new: true});

  res.json(delatedCategory)
}

export { getAllCategories, getCategory, createCategory, updateCategory, deleteCategory };
