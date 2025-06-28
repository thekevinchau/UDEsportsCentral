import { Router } from "express";
import { getUserTeamName } from "../controllers/userController";

const userRouter: Router = Router();


userRouter.get('/:userID', getUserTeamName);



export default userRouter;