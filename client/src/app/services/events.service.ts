import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventCreation, EventResponse } from '../models/events';
import { Config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  getTodayEvents(isOwner: boolean, teamID: string): Promise<EventResponse>{
    if (isOwner){
      return new Promise<EventResponse>((resolve, reject) => {
        this.http.get<EventResponse>(`${Config.apiBaseUrl}/events?filter=today&is_owner=true&team_id=${teamID}`).subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (err) => {
            reject(err);
          }
        });
      })
    }
    else{
      return new Promise<EventResponse>((resolve,reject) => {
        this.http.get<EventResponse>(`${Config.apiBaseUrl}/events?filter=today&is_owner=false`).subscribe({
          next: (data) => {
            resolve(data)
          },
          error: (err) => {
            reject(err);
          }
        })
      })
    }
  }


  getWeeklyEvents(isOwner: boolean, teamID: string, start: string): Promise<EventResponse>{
    if (isOwner){
      return new Promise<EventResponse>((resolve, reject) => {
        this.http.get<EventResponse>(`${Config.apiBaseUrl}/events?filter=week&is_owner=true&start=${start}&team_id=${teamID}`).subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (err) => {
            reject(err);
          }
        });
      })
    }
    else{
      return new Promise<EventResponse>((resolve, reject) => {
        this.http.get<EventResponse>(`${Config.apiBaseUrl}/events?filter=week&is_owner=false&start=${start}`).subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (err) => {
            reject(err);
          }
        })
      })
    }
  }

  createEvent(event: EventCreation){
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    return new Promise<EventResponse>((resolve, reject) => {
      this.http.post<EventResponse>(`${Config.apiBaseUrl}/events`, event, {headers: headers} ).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        }
      })
    })
  }

  deleteEvent(eventID: string){
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }

    return new Promise<EventResponse>((resolve, reject) => {
      this.http.delete<EventResponse>(`${Config.apiBaseUrl}/events/delete/${eventID}`, {headers: headers}).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        }
      })
    })
  }

  editEvent(eventID: string, eventEdits: any){
    return new Promise<EventResponse>((resolve, reject) => {
      this.http.put<EventResponse>(`${Config.apiBaseUrl}/events/edit/${eventID}`, {edits: eventEdits}).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err);
        }
      })
    })
  }

  async getHomeTeamName (userID: string) {
    return new Promise<string>((resolve, reject) => {
      this.http.get<{success: boolean, data: string, statusMessage: string}>(`${Config.apiBaseUrl}/users/${userID}`).subscribe({
        next: (data) => {
          resolve(data.data);
        },
        error: (err) => {
          reject(err);
        }
      })
    })
  }
  }

