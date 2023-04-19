import express from "express";
import cors from "cors";
import router from "../routes/user.routes.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userPath = '/api/users'

    // Middlewares

    this.middlewares();

    // Rutas
    this.routes();
  }

  middlewares() {
    // Directorio público
    this.app.use(express.static("public"));

    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());
  }

  routes() {
   
    this.app.use(this.userPath, router)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`This app is listening at http://localhost:${this.port}`);
    });
  }
}

export default Server;
