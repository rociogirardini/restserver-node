import {Schema, model} from "mongoose";

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    email: {
        type: String, 
        required: [true, 'El correo es obligatorio'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE', 'SAILS_ROLE']
    },
    status: {
        type: Boolean,
        default: true,
    },
    googleAuth: {
        type: Boolean,
        default: false,
    },
});

userSchema.methods.toJSON = function(){
    const { __v, password, ...user } = this.toObject();
    return user;
}


export default model('User', userSchema) 