
import { Router } from 'express';
import {getUsers, postUsers, putUsers, patchUsers, deleteUsers} from '../controllers/user.controller.js'

const router = Router();

router.get("/", getUsers);

  router.post("/", postUsers);

  router.put("/:userId", putUsers);

  router.patch("/", patchUsers);

  router.delete("/", deleteUsers);

export default router;