import { response } from "express";
import { Types } from "mongoose";
const { ObjectId } = Types;

import { User, Product, Category } from "../models/index.js";

const allowedCollections = ["categories", "products", "roles", "users"];

const searchUsers = async (search_term = "", res = response) => {
  const isMongoId = ObjectId.isValid(search_term);

  if (isMongoId) {
    const user = await User.findById(search_term);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(search_term, "i");

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });

  res.json({
    results: users,
  });
};

const searchCategories = async (search_term = "", res = response) => {
  const isMongoId = ObjectId.isValid(search_term);

  if (isMongoId) {
    const category = await Category.findById(search_term);
    return res.json({
      results: category ? [category] : [],
    });
  }

  const regex = new RegExp(search_term, "i");
  const categories = await Category.find({ name: regex, status: true });

  res.json({
    results: categories,
  });
};

const searchProducts = async (search_term = "", res = response) => {
  const isMongoId = ObjectId.isValid(search_term);

  if (isMongoId) {
    const product = await Product.findById(search_term).populate(
      "category",
      "name"
    );
    return res.json({
      results: product ? [product] : [],
    });
  }

  const regex = new RegExp(search_term, "i");

  const products = await Product.find({ name: regex, status: true }).populate(
    "category",
    "name"
  );

  res.json({
    results: products,
  });
};

const search = (req, res = response) => {
  const { collection, search_term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${allowedCollections}`,
    });
  }

  switch (collection) {
    case "categories":
      searchCategories(search_term, res);
      break;
    case "products":
      searchProducts(search_term, res);
      break;
    case "users":
      searchUsers(search_term, res);
      break;
    default:
      res.status(500).json({
        msg: "Se le olvidó hacer esta búsqueda.",
      });
  }
};

export { search };
