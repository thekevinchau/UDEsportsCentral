import {Schema, model} from 'mongoose';


export interface IMatch{
    teams: {
        home: Schema.Types.ObjectId,
        opponent: string,
    }
    score:{
        homeScore: number,
        opponentScore: number
    }
    match_logistics: {
        game_time: Date,
        stream_url: string | null,
        match_urls: [string]
    }
    status: "Scheduled" | "In Progress" | "Finished", //scheduled, in-progress, finished
}


const MatchSchema: Schema = new Schema<IMatch>({
    teams: {
        home: {type: Schema.Types.ObjectId},
        opponent: {type: String}
    },
    score: {
        homeScore: { type: Number},
        opponentScore: { type: Number}
    },
    match_logistics: {
        game_time: {type: Date},
        stream_url: {type: String, nullable: true, default: null},
        match_urls: [{type: String}]
    },
    status: {type: String},
})

const Match = model('Match', MatchSchema)
export default Match;