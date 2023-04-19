import { response } from "express";

const getUsers = (req, res = response) => {

  const { q } = req.query;


  res.json({
    msg: "get API",
    q
  });
};

const postUsers = (req, res = response) => {

  const {nombre, edad} = req.body;

  res.json({
    msg: "post API",
    nombre,
    edad
  });
};

const putUsers = (req, res = response) => {
  const id = req.params.userId;

  res.json({
    msg: "put API",
    id
  });
};

const patchUsers = (req, res = response) => {
    res.json({
      msg: "patch API",
    });
  };

const deleteUsers = (req, res = response) => {
  res.json({
    msg: "delete API",
  });
};

export { getUsers, postUsers, putUsers, patchUsers, deleteUsers };
