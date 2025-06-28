import {Request, Response} from 'express';
import Computer from '../entities/Computer';


/*
This endpoint should only be used for rendering the computers by location.
*/
export const getComputersByLocation = async (req: Request, res: Response): Promise<any> => {
    const location: string = req.query.location as string;

    try{
        const arenaComputers = await Computer.find({location: location.toLowerCase()});

        if (!arenaComputers){
            return res.status(200).json({message: "There are currently no computers listed at this location!"})
        }
        else{
            return res.status(200).json({computers: arenaComputers});
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({errMessage: `Internal server error when trying to fetch computers at ${location}`})
    }
}

/*
This endpoint should only be used for getting information about a specific computer
*/
export const getComputerById = async (req: Request, res: Response): Promise<any> => {
    const id: string = req.params.id as string;

    try{
        const queriedComputer = await Computer.find({_id: id});

        if (!queriedComputer){
            return res.status(200).json({message: "This computer does not currently exist."})
        }
        else{
            return res.status(200).json({computer: queriedComputer});
        }
    }catch(err){
        return res.status(500).json({errMessage: `Internal server error when trying to fetch `})
    }
}


