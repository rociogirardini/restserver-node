import express from "express";
import cors from "cors";
import user_router from "../routes/user.routes.js";
import auth_router from "../routes/auth.routes.js";
import { dbConnection } from "../database/config.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userPath = '/api/users'
    this.authPath = '/api/auth'

    // Conexión DB
    this.conectDB();

    // Middlewares
    this.middlewares();

    // Rutas
    this.routes();
  }

  async conectDB() {
    await dbConnection();
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
   
    this.app.use(this.authPath, auth_router);
    this.app.use(this.userPath, user_router);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`This app is listening at http://localhost:${this.port}`);
    });
  }
}

export default Server;
