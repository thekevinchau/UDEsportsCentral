import {Router} from 'express'
import { createMatch, deleteMatch, getMatches} from '../controllers/matchController';
import { verifyJWT } from '../utils/verifyJWT';

const matchRouter: Router = Router();

matchRouter.get('/', getMatches)
matchRouter.post('/create', verifyJWT, createMatch);
//matchRouter.put('/edit/:matchID', editMatch);
matchRouter.delete('/delete/:id', verifyJWT, deleteMatch)

export default matchRouter;