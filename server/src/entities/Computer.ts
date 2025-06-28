import {Schema, model, ObjectId} from 'mongoose';
import {IReservation, ReservationSchema} from './Reservation';


export interface IComputer{
    identifier: string, //ie. "Stage PC 1, Stage PC 2, Read Room 1, Read Room 2, Side Stage 1, Side Stage 2
    current_res: Schema.Types.ObjectId, //the ID of the team who currently owns the reservation for the PC
    weekly_schedule: IReservation[], //The list of team that are reserved for the rest of the week
    location: string,
    available: boolean //Is the PC available?
}

const computerSchema = new Schema<IComputer>({
    identifier: { type: String, required: true},
    current_res: { type: Schema.Types.ObjectId},
    weekly_schedule: { type: [] },
    location: { type: String},
    available: { type: Boolean, required: true}
})

const Computer = model('Computer', computerSchema);

export default Computer;