import Event from "../entities/Event";
import {Request, Response} from 'express';
import { IEvent } from "../entities/Event";
import { DateInterval, parseDateInterval, parseWeekInterval } from "../utils/parseDate";
//need to get events by week as owner
//need to get events by week as not owner
//need to get events by day as not owner
//need to get events by day as owner

const queryByCurrentDay = async(isOwner: boolean, teamID: string) => {
    const currentDay: DateInterval = parseDateInterval(new Date());
    const notOwnerQuery = {
      "date": {
        $gte: currentDay.start,
        $lt: currentDay.end,
      },
    };

    const isOwnerQuery = {
        $and: [
            { "owner": teamID},
            {
                "date": {
                    $gte: currentDay.start,
                    $lt: currentDay.end
                }
            }
        ]
    }

    const query = isOwner ? isOwnerQuery : notOwnerQuery;
    return await Event.find(query);
}

const getEventByCurrentDay = async(isOwner: boolean, teamID: string) => {
    const events = isOwner ? await queryByCurrentDay(isOwner, teamID) : await queryByCurrentDay(isOwner, '');
    return events.length > 0 ? { success: true, data: events, statusMessage: "Successfully retrieved events for today"} :
    { success: false, data: [], statusMessage: "There are currently no events for today."};
}

const queryEventByWeek = async(isOwner: boolean, teamID: string, start_of_week: Date): Promise<IEvent[]> => {
    const currentWeek: DateInterval = parseWeekInterval(start_of_week);
    const notOwnerQuery = {
        "date": {
            $gte: currentWeek.start,
            $lt: currentWeek.end
        }
    }
    const isOwnerQuery = {
        $and: [
            {"owner": teamID},
            {
                "date": {
                    $gte: currentWeek.start,
                    $lt: currentWeek.end
                }
            }
        ]
    }
    const query = isOwner ? isOwnerQuery : notOwnerQuery;
    const events = await Event.find(query);
    return events;
}

const getEventByWeek = async(isOwner: boolean, teamID: string, start_of_week: Date) => {
    const events: IEvent[] = await queryEventByWeek(isOwner, teamID, start_of_week);
    return events.length > 0 ? { success: true, data: events, statusMessage: "Successfully retrieved events for this week"} :
    { success: false, data: [], statusMessage: "There are currently no events for today."};
}

//when getting event, need to specify whether or not a user is the owner,
//if they are the owner, need to pass in the team_id,
//and a filter for the day or week
export const getEvent = async (req: Request, res: Response) => {
    if (!req.query.is_owner){
        return res.status(400).json({success: false, data: [], statusMessage: "Ownership was not verified!"});
    }

    const isOwner: boolean = req.query.is_owner === "true" ? true : false;
    console.log(isOwner);
    const team_id: string = isOwner ? req.query.team_id as string : '';
    const filter: string = req.query.filter as string;
    let start_of_week: Date;
    if (filter === "today"){
        try{
            return res.status(200).json(await getEventByCurrentDay(isOwner, team_id));
        }catch(err){
            return res.status(500).json({ success: false, data: [], statusMessage: "Internal server error."})
        }
    }

    else if (filter === "week"){
        start_of_week = new Date(req.query.start as string);
        if (!start_of_week){
            return res.status(400).json({success: false, data: [], statusMessage: "Failed to provide a starting date"})
        }
        try{
            return res.status(200).json(await getEventByWeek(isOwner, team_id, start_of_week));
        }catch(err){
            console.error(err);
            return res.status(500).json({success: false, data: [], statusMessage: "Internal server error."});
        }
    }
    else{
        return res.status(400).json({success: false, data: [], statusMessage: "No filter was passed!"});
    }
}

export const createEvent = async (req: Request, res: Response) => {
    const requestBody: IEvent = req.body;
    const userID = req.user?.userID;
    const newEvent = new Event({
        ...requestBody,
        owner: userID
    })

    try{
        const savedEvent:IEvent = await newEvent.save();
        return res.status(201).json({success: true, statusMessage: "Successfully saved event", data: savedEvent})
    }catch(err){
        return res.status(400).json({})
    }
}

const deleteEventHelper = async(eventID: string, userID: string) => {
    try{
        const event = await Event.findOne({_id: eventID});
        if  (String(event?.owner) === userID){
            const deletedEvent = await Event.deleteOne({_id: eventID});
            return { success: true, data: deletedEvent, statusMessage: "Successfully deleted event" }
        }
        else{
            return { success: false, data: {}, statusMessage: "You are not the owner of this event. Failed to delete!"};
        }
    }catch(err){
        return { success: false, data: {}, statusMessage: "Error deleting event"}
    }
}
// need to verify the JWT, get the userID from it, and also grab the matchID from the params 
export const deleteEvent = async(req: Request, res: Response) => {
    const eventID: string = req.params.eventID as string;
    const userID: string = String(req.user?.userID);
    
    try{
        const status = await deleteEventHelper(eventID, userID);
        const statusCode: number = status.success === false ? 400 : 200;
        return res.status(statusCode).json(status);
    }catch(err){
        console.error(err);
        return res.status(500).json({success: false, data: {}, statusMessage: "Internal server error when deleting match"})
        
    }
}
//performs edits on only the keys that have strings as their values; ie: eventName, location, eventDescription
const editByStringKeys = async (eventID: string, key: string, value: string) => {
    try{
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: eventID },
            { [key]: value }, // Dynamically set the key
            { new: true }      // Return the updated document
        );
    }catch(err){
        console.error(err);
    }
}

const editByDateKey = async (eventID: string, value: Date) => {
    try {
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: eventID },
            { 'date': value }, // Dynamically set the key
            { new: true }      // Return the updated document
        );
    }catch(err){
        console.error(err);
    }
}
//take in the contents of the body, which will be an object. then loop over the key value pairs. check if the key is equal to so and so edit,
//then call the edit on it
export const editEvent = async (req: Request, res: Response) => {
    const {edits} = req.body;
    const eventID = req.params.eventID;
    try{
        for (const [key,value] of Object.entries(edits)){
            if (key !== "date"){
                const stringValue = String(value);
                await editByStringKeys(eventID, key, stringValue);
            }
            else{
                await editByDateKey(eventID, value as Date);
            }
        }
        return res.status(201).json({success: true, data: {}, statusMessage: "Successfully updated event!"});
    }catch(err){
        console.error(err);
        return res.status(500).json({success: false, data: {}, statusMessage: "Internal server error when updating event."})
    }
}