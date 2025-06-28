import{ Request, Response, Router } from 'express';
import authRouter from './authRoutes';
import { verifyJWT } from '../utils/verifyJWT';
import reservationRouter from './reservationRouter';
import announcementRouter from './announcementRouter';
import computerRouter from './computerRouter';
import matchRouter from './matchRouter';
import userRouter from './userRouter';
import eventRouter from './eventRouter';
const apiRouter: Router = Router();


apiRouter.get('/', verifyJWT, (req: Request, res: Response) => {
    console.log(req.user);
    res.status(200).json({user: req.user});
})
apiRouter.use('/auth', authRouter)
apiRouter.use('/reservations', reservationRouter)
apiRouter.use('/users', userRouter);
apiRouter.use('/announcements', announcementRouter)
apiRouter.use('/computers', computerRouter)
apiRouter.use('/matches', matchRouter)
apiRouter.use('/events', eventRouter)

export default apiRouter;

