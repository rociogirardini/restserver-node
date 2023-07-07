import express from "express";
import cors from "cors";
import user_router from "../routes/user.routes.js";
import auth_router from "../routes/auth.routes.js";
import { dbConnection } from "../database/config.js";
import categ_router from "../routes/categories.routes.js";
import products_router from "../routes/products.routes.js";
import search_router from "../routes/search.routes.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: '/api/auth',
      categ: '/api/categories',
      user: '/api/users',
      products: '/api/products',
      search: '/api/search'
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
  }

  routes() {
   
    this.app.use(this.paths.auth, auth_router);
    this.app.use(this.paths.search, search_router);
    this.app.use(this.paths.user, user_router);
    this.app.use(this.paths.categ, categ_router);
    this.app.use(this.paths.products, products_router);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`This app is listening at http://localhost:${this.port}`);
    });
  }
}

export default Server;
