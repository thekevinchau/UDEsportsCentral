import {Schema, model} from 'mongoose';

interface IAnnouncement{
    message: string,
    createdAt: String,
    updatedAt: String,
    createdBy: string
}


const AnnouncementSchema = new Schema<IAnnouncement>({
    message: { type: String, required: true},
    createdAt: { type: String, required: true},
    updatedAt: {type: String},
    createdBy: {type: String, required: true}
})


const Announcement = model('announcement', AnnouncementSchema);

export default Announcement;