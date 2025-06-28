import { Request, Response } from "express";
import User from "../entities/User";



export const getUserTeamName = async (req: Request, res: Response) => {
    const userID: string = req.params.userID;
    try{
        const user = await User.findById(userID)
        if (!user){
            return res.status(404).json({success: false, data: '', statusMessage: 'User not found!'});
        }
        return res.status(200).json({success: true, data: user.team_name, statusMessage: 'Successfully found user!'})

    }catch(err){
        console.error(err);
    }
}