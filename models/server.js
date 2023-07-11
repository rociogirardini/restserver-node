import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import user_router from "../routes/user.routes.js";
import auth_router from "../routes/auth.routes.js";
import { dbConnection } from "../database/config.js";
import categ_router from "../routes/categories.routes.js";
import products_router from "../routes/products.routes.js";
import search_router from "../routes/search.routes.js";
import uploads_router from "../routes/uploads.routes.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: '/api/auth',
      categ: '/api/categories',
      user: '/api/users',
      products: '/api/products',
      search: '/api/search',
      uploads: '/api/uploads',
    }

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

    // Manejo de carga de archivos
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true,
  }));
  }

  routes() {
   
    this.app.use(this.paths.auth, auth_router);
    this.app.use(this.paths.search, search_router);
    this.app.use(this.paths.user, user_router);
    this.app.use(this.paths.categ, categ_router);
    this.app.use(this.paths.products, products_router);
    this.app.use(this.paths.uploads, uploads_router);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`This app is listening at http://localhost:${this.port}`);
    });
  }
}

export default Server;
