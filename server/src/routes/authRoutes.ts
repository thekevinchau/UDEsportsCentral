import { Router, Request, Response } from "express";
import * as jwt from 'jsonwebtoken'
import User from "../entities/User";
import dotenv from 'dotenv';
dotenv.config();
const authRouter: Router = Router();
const JWT_SECRET: string = String(process.env.JWT_SECRET);

authRouter.post('/', async (req: Request, res: Response) => {
    const {username, password} = req.body;

    try{
        //If they are a user in the system (by checking if the user at least exists)
        const user = await User.findOne({username});
        if (!user){
            return res.status(403).json({message: 'User does not exist!'});
        }
        //If they are a user, then it checks their password by comparing the hashes of both the password and user password.
        const isSamePassword: boolean = (password === user.password);
        if (!isSamePassword){
            return res.status(403).json({message: "Incorrect password!"});
        }

        /*
        
        We sign the token if the username and password are correct. When the token is signed, we include the payload
            - The payload includes userId, userRole, teamName
        
        The user inside the request object will then have access to all of these fields
        */
        const token = jwt.sign({userID: user._id, isAdmin: user.admin, teamName: user.team_name}, JWT_SECRET, {expiresIn: '36000s'});
        return res.status(200).json({token: token})


    }catch(err){
        return res.status(500).json({message: "Server error when trying to authenticate user!"})
    }
})
export default authRouter;