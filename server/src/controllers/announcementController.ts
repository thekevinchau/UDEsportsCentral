import { Request, Response} from "express";
import Announcement from "../entities/Announcement";
import User from "../entities/User";
import {validationResult } from "express-validator";


/*

The createAnnouncement function first validates the request body to ensure that it is not empty and the fields passed in are of type string.
It then parses all the fields passed in from the request body into read-able format and stores it in the database.

*/
export const createAnnouncement = async (req: Request, res: Response): Promise<any> => {
  const result = validationResult(req)
  console.log(result);

  const user = await User.findOne({ _id: req.user?.userID });
  const date = req.body.announcement.createdAt;
  const newAnnouncement = new Announcement({
    message: req.body.announcement.message,
    createdAt: date,
    updatedAt: date,
    createdBy: user?.username
  })
  try {
    await newAnnouncement.save();
    return res.status(201).json(
      {
        _id: newAnnouncement._id,
        message: newAnnouncement.message,
        updatedAt: newAnnouncement.updatedAt,
        createdAt: newAnnouncement.createdAt,
        createdBy: newAnnouncement.createdBy,
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error when creating announcement" });
  }
};

export const getAnnouncements = async (req: Request, res: Response): Promise<any> => {
  const search: string = req.query.search as string;
  const result = validationResult(req);
  console.log(result);
  try{
    //if the search is all
    if (search === "all"){
      const announcements = await Announcement.find();

      if (!announcements){
        return res.status(200).json({ message: 'There are currently no announcements', announcements: []});
      }

      else{
        return res.status(200).json({ announcements: announcements})
      }
    }
    else{
      const announcement = await Announcement.findById(search);
      if (announcement === null){
        return res.status(200).json({ message: "This announcement does not currently exist!", announcement: announcement});
      } 
      else{
        return res.status(200).json({announcement: announcement});
      } 
    }
  }catch(err){
    return res.status(500).json({message: 'Internal server error when retrieving announcements'});
  }
}

export const updateAnnouncement = async (
  req: Request,
  res: Response
): Promise<any> => {
  //grab ID from query
  //grab new message from the body
  if (!req.query.id){
    return res.status(400).send("You must specify an announcement to update!");
      
  }

  if (!Object.keys(req.body).length){
    return res.status(400).send("No changes were made to the announcement.")
    ;
  }

  else{
    const announcement_id: string = req.query.id as string;
    const new_message: string = req.body.newMessage;
    const updatedAt: string = req.body.updatedAt;
    console.log(updatedAt);

    try{
      const updatedAnnouncement = await Announcement.findByIdAndUpdate({_id: announcement_id}, { message: new_message, updatedAt: updatedAt}, { new: true });
      return res.status(201).json(
        {
          _id: updatedAnnouncement?._id,
          message: updatedAnnouncement?.message,
          updatedAt: updatedAnnouncement?.updatedAt,
          createdAt: updatedAnnouncement?.createdAt,
          createdBy: updatedAnnouncement?.createdBy,
        }
      );
    }catch(err){
      console.error(err);
      return res.status(500).json({message: 'Internal server error when updating announcement!'})
    }
  }
}


/*



*/
export const deleteAnnouncement = async (req: Request, res: Response): Promise<any> => {
  if (!req.query.id) {
    return res.status(400).json({ message: "You must specify an announcement to delete! ID: " + req.query.id });
  }

  try {
    const announcement_id: string = req.query.id as string;
    const deletedAnnouncement = await Announcement.deleteOne({ _id: announcement_id });
    if (deletedAnnouncement.deletedCount === 0){
      return res.status(409).json({ message: "The message you intended to delete does not exist!"})
    }
    else{
      return res.status(200).json({ message: `Announcement successfully deleted!`})
    }
  } catch (err) {
    console.error("Error deleting announcemnet", err);
    res.status(500).json({ message: "Internal server error when deleting announcement" });
  }
};