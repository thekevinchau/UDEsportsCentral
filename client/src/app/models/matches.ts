export interface IMatch{
    teams: {
        home: string,
        opponent: string,
    }
    score:{
        homeScore: number,
        opponentScore: number
    }
    match_logistics: {
        game_time: string,
        stream_url: string | null,
        match_urls: [string]
    }
    status: "Scheduled" | "In Progress" | "Finished" | "", //scheduled, in-progress, finished,
    _id: string
}

export interface MatchResponse {
    success: boolean,
    data: IMatch[],
    statusMessage: string
}


export interface MatchCreation {
    teams: {
        home: string,
        opponent: string
    },
    score: {
        homeScore: number,
        opponentScore: number
    },
    match_logistics: {
        game_time: string,
        stream_url: string,
        match_urls: string[]
    }
    status: "Scheduled" | "In Progress" | "Finished",
}

export interface MatchCreationResponse {
    successMessage: string
    data: MatchCreation,
    success: boolean 
}

export interface MatchDeletionResponse {
    successMessage: string,
    deletedMatch: IMatch,
    success: boolean
}