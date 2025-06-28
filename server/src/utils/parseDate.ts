/*
Function: parseDateInterval
Params: (query_date: Date)
Returns: ISOString casted start time interval and end time interval
Description: Helper function that consumes a date object and creates a variable to indicate the start of the day and a variable to indicate the end of the day by manually setting the hours. 
- This function is used to aid in querying in the "getMatchesByDate" function.
- It is parsed into an ISOString so that it is recognizable for Mongoose to use.

*/
export interface DateInterval{
  start: string,
  end: string
}

export const parseDateInterval = (query_date: Date): DateInterval => {
    const start: number = query_date.setHours(0, 0, 0, 0);
    const end: number = query_date.setHours(23, 59, 59, 999);
  
    return {
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
    };
  };

export const parseWeekInterval = (start_of_week: Date): DateInterval => {
  const start: number = start_of_week.setHours(0,0,0,0);
  const end: number = new Date(start_of_week.setDate(start_of_week.getDate() + 6)).setHours(23,59,59,999); //sets the end date to be 6 days from the 
  //start date and the hours to be 23:59:59:999 of that day.

  return {
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString()
  }
}
