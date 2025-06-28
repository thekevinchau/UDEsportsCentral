import { Request, Response } from "express";
import Reservation, { IReservation } from "../entities/Reservation";
import { ObjectId } from "mongoose";


interface Reservation {  
  num_pcs: number;
  start: Date;
  reason: Date;
  end: string;
}

//A key value pair with the day as the key and a reservation object as the value.
interface TeamReservations {
  reservations: {
    [day: string]: Reservation;
  };
}

//<------------------------------------------------------------ GETTING A RESERVATION ------------------------------------------------------------------------------------>
export const getReservations = async(req: Request, res: Response) => {
  const userID = req.user?.userID;
  try{
  if (!userID){
    return res.status(404).json({message: 'Team does not exist!'});
  }

    const teamReservations = await Reservation.find({owner: userID})
    if (teamReservations.length === 0){
      return res.status(404).json({message: 'There are no current reservations for this team.'});
    }
    else{
      return res.status(200).json(teamReservations)
    }
  }
  catch(err){
    return res.status(500).json({message: 'Server error when retrieving reservations'})
  }
}

export const getAllReservations = async(req: Request, res: Response) => {
  try{
    const teamReservations = await Reservation.find()
    if (teamReservations.length === 0){
      return res.status(404).json({message: 'There are no current reservations for this team.'});
    }
    else{
      return res.status(200).json(teamReservations)
    }
  }
  catch(err){
    return res.status(500).json({message: 'Server error when retrieving reservations'})
  }
}
//<------------------------------------------------------------ CREATING A RESERVATION ------------------------------------------------------------------------------------>

export const createReservation = async (
  req: Request,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(403).json({ message: "You are not logged in!" });
  }

  const { userID, teamName } = req.user;
  let reservationMessages: string[] = [];
  const reservation: IReservation = req.body;
  console.log(reservation);

  try {
    const newReservation = new Reservation({
      owner: userID,
      team_name: reservation.team_name, 
      start_time: reservation.start_time,
      end_time: reservation.end_time,
      room: reservation.room,
      computers: reservation.computers,
      reason: reservation.reason,
      approved: reservation.approved
    })

    await newReservation.save();
    
    return res.status(201).json({ message: reservationMessages });
  } catch (err) {
    console.error("Error creating reservation", err);
    return res
      .status(500)
      .json({ message: "Server error occurred when making reservation" });
  }
};



//<------------------------------------------------------------ EDITING A RESERVATION ------------------------------------------------------------------------------------>
/*

- Editing a reservation...
    - Search for the reservation by its ID from the request body
    - Grab the day, start_time, end_time, and num_pcs from the request body and make the edit.
    - validate that the user is editing their own reservation
*/
interface reservationEdits {
  start_time: Date | null,
  end_time: Date | null,
  approved: boolean | null,
}

//Helper function to help edit as an admin to reduce clutter in primary editReservation function.
  // - hopefully self explanatory
const editAsAdmin = async(reservationID: string, reservationEdits: reservationEdits) => {
  try{
    const reservation = await Reservation.findOneAndUpdate({_id: reservationID}, {
      start_time: reservationEdits.start_time,
      end_time: reservationEdits.end_time,
      approved: reservationEdits.approved || null,
    });
    console.log(reservation);
    return reservation;
  }catch(err){
    console.error(err);
  }
}

//Helper function to help edit as an admin to reduce clutter in primary editReservation function.
  // - hopefully self explanatory
const editAsUser = async(reservationID: string, userID: string, reservationEdits: reservationEdits) => {
  try{
    const reservation = await Reservation.findOneAndUpdate({_id: reservationID, owner: userID}, {
      start_time: reservationEdits.start_time,
      end_time: reservationEdits.end_time
    })
    console.log(reservation);
    return reservation;
  }catch(err){
    console.error(err);
  }
}

/*
editReservation: Retrieve reservation edits from the body (see reservationEdits below)
*/

export const editReservation = async (req: Request,res: Response): Promise<any> => {
  if (Object.keys(req.body).length === 0) {
    return res.status(204).json({ message: "No changes were made!" });
  }
  const reservationID = req.body.id || null;
  const reservationEdits: reservationEdits = {
    start_time: req.body.start_time || null,
    end_time: req.body.end_time || null,
    approved: req.body.approved || null,
  }

  console.log(reservationID);
  console.log(req.body);

  //if the user is not an admin and they don't provide their userID in the body then they shouldn't be able to edit other users' reservations
  if (!req.user?.isAdmin && !req.body.userID){
    return res.status(403).json({ message: "You are not able to edit other user's reservations!"})
  }
  //if the user is not an admin BUT they provide their userID in the body, then they should be able to edit only their own reservation.
  else if (!req.user?.isAdmin && req.body.userID){
    try{
      const reservation = await editAsUser(reservationID, req.body.userID, reservationEdits)
      if (!reservation){
        return res.status(404).json({ message: "404 Error: Reservation Not Found."})
      }
      return res.status(201).json({ success: true, statusMessage: "Successfully updated user!", reservation: 
        { reservationID: reservationID, start_time: reservation.start_time, end_time: reservation.end_time }})
    }catch(err){
      return res.status(500).json({success: false, statusMessage: "Internal server error when attempting to edit the reservation!"})
    }
  }
  //if the edit is being made by an admin, then they shouldn't have any restrictions and can freely edit anyone's reservation.
  else{
    try{
      const reservation = await editAsAdmin(reservationID, reservationEdits)
      if (!reservation){
        return res.status(404).json({message: "404 Error: Reservation Not Found."})
      }
      return res.status(201).json({success: true, statusMessage: "Successfully updated user!", data: 
        { reservationID: reservationID, start_time: reservation.start_time, end_time: reservation.end_time, approved: reservation.approved }})
    }catch(err){
      return res.status(500).json({success: false, statusMessage: "Internal server error when attempting to edit the reservation!"})
    }
  }
};

//<------------------------------------------------------------ EDITING A RESERVATION ------------------------------------------------------------------------------------>


//aims to follow same structure as editing a reservation.

const deleteAsUser = async(reservationID: string, userID: string): Promise<any> => {
  try{
    const reservation = await Reservation.findOneAndDelete({_id: reservationID, owner: userID});
    return reservation;
  }catch(err){
    console.log(err);
  }

}

const deleteAsAdmin = async(reservationID: string): Promise<any> => {
  try{
    const reservation = await Reservation.findByIdAndDelete({_id: reservationID});
    return reservation;
  }
  catch(err){
    console.log(err);
  }
}



export const deleteReservation = async (
  req: Request,
  res: Response
): Promise<any> => {
  const reservationID: string = req.params.reservationID;
  const userID: string = req.query.userID as string;
  console.log(reservationID);
  console.log(userID);

  try{
    // if the user is not an admin and they don't provide a userID, they shouldn't be able to delete other users' reservations.
    if (!req.user?.isAdmin && !userID){
      return res.status(401).json({success: false, statusMessage: "Users cannot delete other users' reservations!"})
    }

    // if the user is not an admin and they do provide a userID, then they can delete their own reservations only
    else if (!req.user?.isAdmin && userID){
      const deleted: TeamReservations = await deleteAsUser(reservationID, userID)

      if (!deleted){
        return res.status(404).json({success: false, statusMessage: "Reservation to be deleted was not found!", data: []})
      }
      return res.status(200).json({success: true, statusMessage: "Successfuly deleted reservation!", data: {deleted}})
    }

    //otherwise, if the user is an admin, they don't need a userID but they can also delete any reservation.
    else{
      const deleted: TeamReservations = await deleteAsAdmin(reservationID)

      if (!deleted){
        return res.status(404).json({success: false, statusMessage: "Reservation to be deleted was not found!", data: []})
      }

      return res.status(200).json({success: true, statusMessage: "Successfully deleted reservation!", data: {deleted}})
    }
    
  }catch(err){
    console.error('Error deleting reservation', err);
    return res.status(500).json({message: "Internal server error when attempting to delete reservation!"});
  }
}
