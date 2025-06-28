import { Router } from "express";
import { createEvent, deleteEvent, editEvent, getEvent } from "../controllers/eventController";
import { verifyJWT } from "../utils/verifyJWT";


const eventRouter: Router = Router();

eventRouter.get('/', getEvent)
eventRouter.post('/', verifyJWT, createEvent);
eventRouter.delete('/delete/:eventID', verifyJWT, deleteEvent);
eventRouter.put('/edit/:eventID', editEvent)


export default eventRouter;