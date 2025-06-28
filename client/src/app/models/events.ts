export interface IEvent{
    _id: string,
    eventName: string,
    owner: string,
    date: Date,
    description: string,
    location: string
}

export interface EventResponse {
    success: boolean,
    data: IEvent[],
    statusMessage: string
}
export interface EventCreation {
    eventName: string,
    date: Date,
    description: string,
    location: string
}