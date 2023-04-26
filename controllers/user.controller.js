import { request, response } from "express";
import bcryptjs from "bcryptjs";
import User from "../models/user.js";

const getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const q = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(q),
    User.find(q).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    total,
    users,
  });
};

const postUsers = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Encriptar password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Guardar en DB
  await user.save();

  res.json({
    user,
  });
};

const putUsers = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, googleAuth, email, ...rest } = req.body;

  // TODO validar contra base de datos
  if (password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.json({
    user,
  });
};

const patchUsers = (req, res = response) => {
  res.json({
    msg: "patch API",
  });
};

const deleteUsers = async (req, res = response) => {
  const { id } = req.params;

  // const user = await User.findByIdAndDelete(id);

  const user = await User.findByIdAndUpdate(id, { status: false });

  res.json(user);
};

export { getUsers, postUsers, putUsers, patchUsers, deleteUsers };
