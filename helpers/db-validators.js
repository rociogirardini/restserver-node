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
  const userExists = await User.findById( id );
  if (!userExists) {
    throw new Error(`El ID ${id} no existe.`);
  }
};

export { roleIsValid, emailExist, userExist };
