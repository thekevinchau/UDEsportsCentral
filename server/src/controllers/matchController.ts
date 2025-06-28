import { Request, Response } from "express";
import {
  DateInterval,
  parseDateInterval,
  parseWeekInterval,
} from "../utils/parseDate";
import Match, { IMatch } from "../entities/Match";


/*

Grabs all the fields from the request body and creates a match. The body is expected to have the same format as the Match interface as referenced by
"IMatch" to ensure compatibility.

It will then return a JSON indicating the status of the request and the data payload.

*/
//<------------------------------------------------------------------------------------ CREATING MATCHES  ------------------------------------------------------------------------------------------------------------------------------------------->
export const createMatch = async (req: Request, res: Response): Promise<any> => {
  const parsed_body = new Match({
    teams: {
      ...req.body.teams,
    },
    score: {
      ...req.body.score,
    },
    match_logistics: {
      ...req.body.match_logistics,
      match_urls: [...req.body.match_logistics.match_urls],
    },
    status: req.body.status,
  });

  try {
    const match = await parsed_body.save();
    return res
      .status(201)
      .json({ successMessage: `Match created!`, data: match, success: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        errorMessage: "Internal server error when creating a match!",
        success: false,
      });
  }
};

//<------------------------------------------------------------------------------------ GETTING MATCHES BY JUST THE DAY ------------------------------------------------------------------------------------------------------------------------------------------->

/*

parsedDate: Parses the current day into an ISOString starting from 0:0:00 and ending at 23:59:59.

Finding a match depends on two factors
  - Whether we're showing the matches for a particular user's dashboard
    - If so, we're going to set isOwner to true, and pass in the team_id so we know whose matches to query for
      - This is indicated by isOwnerQuery
  - Or for general users to see
    - If so, we're going to set isOwner to false, and this will ignore the team_id in the query. This is for fetching all the matches for the current day.
    - This is indicated by notOwnerQuery.

  - Then it will find the match based on the query.
*/

const findTodayMatches = async (isOwner: boolean, team_id: string) => {
  const parsedDates: DateInterval = parseDateInterval(new Date());
  const notOwnerQuery = {
    "match_logistics.game_time": {
      $gte: parsedDates.start,
      $lt: parsedDates.end,
    },
  };
  const isOwnerQuery = {
    $and: [
      { "teams.home": team_id },
      {
        "match_logistics.game_time": {
          $gte: parsedDates.start,
          $lt: parsedDates.end,
        },
      },
    ],
  };
  console.log(isOwner ? 'IsOwnerQuery was called' : 'NotOwnerQuery was called!')
  const query = isOwner && team_id !== '' ? isOwnerQuery : notOwnerQuery;
  const matches = await Match.find(query);
  return matches;
};

/*

This is in essence a helper function to return the json object that will be sent back in the response of the getMatch function.
Used to declutter the getMatches function when sending the response.

*/
const fetchTodayMatches = async (isOwner: boolean, team_id: string) => {
  const matches = isOwner
    ? await findTodayMatches(true, team_id)
    : await findTodayMatches(false, "");
  return matches.length > 0
    ? { success: true, data: matches }
    : {
        success: true,
        data: [],
        statusMessage: "There are currently no matches",
      };
};

//<------------------------------------------------------------------------------------ GETTING MATCHES BY JUST THE DAY ------------------------------------------------------------------------------------------------------------------------------------------->



//<------------------------------------------------------------------------------------ GETTING MATCHES BY THE WEEK ------------------------------------------------------------------------------------------------------------------------------------------->

const findWeeklyMatches = async(isOwner: boolean, team_id: string, start_date: Date) => {
  const parsedDates: DateInterval = parseWeekInterval(start_date);
  const notOwnerQuery = {
    "match_logistics.game_time": {
      $gte: parsedDates.start,
      $lt: parsedDates.end
    }
  }

  const ownerQuery = {
    $and: [
      {"teams.home": team_id},
      {"match_logistics.game_time": {
        $gte: parsedDates.start,
        $lt: parsedDates.end
      }}
    ]
  }
  try{
    const query = isOwner && team_id !== '' ? ownerQuery : notOwnerQuery;
    const matches = await Match.find(query);
    return matches;
  }catch(err){
    console.error(err);
    return [];
  }
}

const fetchWeeklyMatches = async(isOwner: boolean, team_id: string, start_date: Date) => {
  try{
    const matches = await findWeeklyMatches(isOwner, team_id, start_date);
    return matches.length > 0 ? { success: true, data: matches, statusMessage: "Successfully retrieved matches"} : { success: true, data: [], statusMessage: "No matches were found for this week."}
  }catch(err){
    console.error(err);
    return { success: false, data: [], statusMessage: "Error retrieving matches."}
  }
}

/*

Handles all the fetching by day and week and condenses into one function in order to send a response.

*/
export const getMatches = async (req: Request, res: Response) => {

  const filter: string = req.query.filter as string;
  const isOwner: boolean = req.query.is_owner === "true";
  let team_id: string = isOwner ? (req.query.team_id as string) : "";
  let start_of_week: Date;

  if (filter === "today") {
    try {
      return res.status(200).json(await fetchTodayMatches(isOwner, team_id));
    } catch (err) {
      console.error(err);
    }
  }
  else if (filter === 'week'){
    start_of_week = new Date(req.query.start_date as string);
    try{
      return res.status(200).json(await fetchWeeklyMatches(isOwner, team_id, start_of_week))
    }catch(err){
      console.error(err);
    }
  }
  else{
    return res.status(400).json({ success: false, data: [], statusMessage: 'You have not passed in a filter.'})
  }
};

/*

Finds the match according to the ID. This will be helpful when clicking on a match to expand its details. This should theoretically be used to open up
a different page or a modal for the match.

*/

export const getMatchById = async (req: Request, res: Response) => {
  const matchID: string = req.params.matchID as string;

  try{
    const match: IMatch | null = await Match.findById(matchID);

    if (!match){
      return res.status(404).json({ success: true, data: [], statusMessage: '404 Error: Page Not Found'})
    }
    else{
      return res.status(200).json({success: true, data: match})
    }
  }catch(err){
    return res.status(500).json({success: false, data: [], statusMessage: '500 Error: Internal server error when retrieving match.'})
  }
}

//<------------------------------------------------------------------------------------ UPDATING MATCHES ------------------------------------------------------------------------------------------------------------------------------------------->

//<------------------------------------------------------------------------------------ DELETING MATCHES ------------------------------------------------------------------------------------------------------------------------------------------->

/*
Deleting the match is a work in progress. Do not call this function for now.
*/

export const deleteMatch = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const userID: string = String(req.user?.userID);
  try {
    const deletedMatch: IMatch | null = await Match.findByIdAndDelete({ _id: id });
    if (!(String(deletedMatch?.teams.home) === userID)){
      return res.status(401).json({
        success: false,
        statusMessage: "The match you are trying to delete does not belong to the user currently signed in!",
        deletedMatch: {}
      })
    }
    res
      .status(200)
      .json({
        success: true,
        statusMessage: "Match has been successfully deleted!",
        deletedMatch: deletedMatch,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        statusMessage: "Internal server error when deleting match",
        deletedMatch: {}
      });
    console.error(err);
  }
};