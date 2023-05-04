import { request, response } from "express";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import generateJWT from "../helpers/generate-jwt.js";
import googleVerify from "../helpers/google-verify.js";

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si existe email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Usuario o contraseña es incorrecto | Correo",
      });
    }

    // Verificar si el usuario está activo
    if (!user.status) {
      return res.status(400).json({
        msg: "El email ya no es un usuario de la plataforma",
      });
    }

    // Verificar contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario o contraseña es incorrecto | Password",
      });
    }

    // Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Contacte con soporte.",
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, picture, email } = await googleVerify(id_token);
    
    let user = await User.findOne({ email });

    if ( !user ) {
      // Crear usuario
      const data = {
        name,
        email,
        password: 'password',
        picture,
        googleAuth: true,
        role: 'USER_ROLE'
      }

      user = new User(data);
      await user.save();
    }

    // Verificar si el usuario no está eliminado

    if( !user.status) {
      return res.status(401).json({
        msg: 'Contacte con soporte | Hable con el administrador'
      })
    }

    // Generar token

    const token = await generateJWT(user.uuid)

    res.json({
      user,
      token
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar'
    })
  }
};

export { login, googleSignIn };
