import { Router, Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/verifyJWT";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../controllers/announcementController";
import { body, query } from "express-validator";

const announcementRouter: Router = Router();

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
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

announcementRouter.post(
  "/create",
  verifyJWT,
  verifyAdmin,
  [
    body("announcement.message")
      .isString()
      .withMessage("String was not passed!")
      .notEmpty()
      .withMessage("You passed an empty message")
      .isLength({ min: 3, max: 100 })
      .withMessage(
        "Announcement must be longer than 3 characters and less than 100 characters!"
      ),
    body("announcement.createdAt")
      .isString()
      .withMessage("CreatedAt must be a string object!"),

    body("announcement.updatedAt")
      .isString()
      .withMessage("UpdatedAt must be a string object!"),
  ],
  createAnnouncement
);
announcementRouter.delete(
  "/delete",
  verifyJWT,
  verifyAdmin,
  deleteAnnouncement
);

//No need to protect when getting announcements, as everyone should have access
announcementRouter.get(
  "/",
  query("search")
    .notEmpty()
    .withMessage("Search query must not be empty!")
    .isString()
    .withMessage("Search query must be a string!"),
  getAnnouncements
);
announcementRouter.put("/edit",
  query('id')
  .notEmpty()
  .withMessage('Search query must not be empty!')
  .isString()
  .withMessage('Search query must be a string!'),
  updateAnnouncement);

export default announcementRouter;
