import { ObjectId, Schema, model } from "mongoose";

export interface IEvent{
    eventName: string,
    owner: ObjectId
    date: Date,
    description: string,
    location: string | ''
}

const EventSchema = new Schema<IEvent>({
    eventName: {type: String},
    owner: { type: Schema.Types.ObjectId },
    date: {type: Date},
    description: {type: String},
    location: {type: String}
})

const Event = model('Event', EventSchema)

export default Event;