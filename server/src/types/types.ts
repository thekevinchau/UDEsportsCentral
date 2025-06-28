import { ObjectId } from "mongoose"

declare global {
    namespace Express {
        interface Request {
            user?: {
                userID: ObjectId,
                isAdmin: boolean,
                teamName: string
            }; // Make it optional if it may not always be present
        }
    }
}