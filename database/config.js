import mongoose from "mongoose";

const dbConnection = async (err, res) => {

    const uri = process.env.MONGODB_CNN

    mongoose.connect(uri)

    if(err){
        console.log(err);
        throw new Error ('Error en la base de datos');
    } 

    console.log('Conectado a la base de datos.');
};

export { dbConnection };
