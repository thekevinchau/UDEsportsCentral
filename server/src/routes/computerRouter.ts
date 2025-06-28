import { Router } from "express";
import { getComputerById, getComputersByLocation } from "../controllers/computerController";
import { verifyJWT } from "../utils/verifyJWT";
const computerRouter: Router = Router();


computerRouter.get('/', verifyJWT, getComputersByLocation);
computerRouter.get('/:id', verifyJWT, getComputerById);

export default computerRouter;