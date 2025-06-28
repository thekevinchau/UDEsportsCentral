import {Request, Response, NextFunction} from 'express';


export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: "You are not logged in!" });
    } else if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can create announcements!" });
    } else {
      next();
    }
  };