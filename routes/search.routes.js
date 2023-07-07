import { Router } from "express";
import { search } from "../controllers/search.controller.js";


const search_router = Router();

search_router.get("/:collection/:search_term", search)


export default search_router;