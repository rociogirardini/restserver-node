import { request, response } from "express";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import generateJWT from "../helpers/generate-jwt.js";


const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si existe email
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(400).json({
            msg: "Usuario o contraseña es incorrecto | Correo"
        })
    }

    // Verificar si el usuario está activo
    if(!user.status) {
        return res.status(400).json({
            msg: "El email ya no es un usuario de la plataforma"
        })
    }

    // Verificar contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if(!validPassword) {
        return res.status(400).json({
            msg: "Usuario o contraseña es incorrecto | Password"
        })
    }

    // Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Contacte con soporte.",
    });
  }
};

export default login;
