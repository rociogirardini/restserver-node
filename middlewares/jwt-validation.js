import { request, response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const jwtValidation = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    // Verificar que el token es válido
    const { uuid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Leer el usuario que corresponde al uuid
    const user = await User.findById(uuid);

    if (!user) {
      return res.status(401).json({
        msg: "Token no válido | Usuario no existente en DB",
      });
    }

    // Verificar si el uuid tiene su status en true (usuario no eliminado)
    if (!user.status) {
      return res.status(401).json({
        msg: "Token no válido | Usuario eliminado",
      });
    }

    req.user = user;
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Token no válido.",
    });
  }

  next();
};

export { jwtValidation };
