import {Router} from 'express';
import { createReservation, deleteReservation, editReservation, getReservations, getAllReservations } from '../controllers/reservationController';
import { verifyJWT } from '../utils/verifyJWT';

const reservationRouter: Router = Router();

reservationRouter.post('/create', verifyJWT, createReservation)
reservationRouter.put('/edit', verifyJWT, editReservation)
reservationRouter.delete('/delete/:reservationID', verifyJWT, deleteReservation)
reservationRouter.get('/', verifyJWT, getReservations)
reservationRouter.get('/all', getAllReservations)


export default reservationRouter;