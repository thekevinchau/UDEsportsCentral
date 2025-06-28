import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IMatch, MatchCreation, MatchCreationResponse, MatchDeletionResponse, MatchResponse } from '../models/matches';
import { Config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  constructor(private http: HttpClient ) {}
  async getTodayMatches (isOwner: boolean, team_id: string) {
    const notOwnerReq = new Promise<IMatch[]>((resolve, reject) => {
      this.http.get<MatchResponse>(`${Config.apiBaseUrl}/matches?filter=today&is_owner=false`).subscribe({
        next: (data) => {
          resolve(data.data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
    const ownerReq = new Promise<IMatch[]>((resolve, reject) => {
      this.http.get<MatchResponse>(`${Config.apiBaseUrl}/matches?filter=today&is_owner=true&team_id=${team_id}`).subscribe({
        next: (data) => {
          resolve(data.data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
    return isOwner ? ownerReq : notOwnerReq;
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

  async getWeeklyMatches (isOwner: boolean, team_id: string, start_date: string){
    const ownerReq = new Promise<IMatch[]>((resolve, reject) => {
      console.log('TeamID from service call', team_id);
      this.http.get<MatchResponse>(`${Config.apiBaseUrl}/matches?filter=week&is_owner=true&team_id=${team_id}&start_date=${start_date}`).subscribe({
        next: (data) => {
          resolve(data.data);
        },
        error: (err) => {
          reject (err);
        }
      })
    })

    const notOwnerReq = new Promise<IMatch[]>((resolve, reject) => {
      this.http.get<MatchResponse>(`${Config.apiBaseUrl}/matches?filter=week&is_owner=false&start_date=${start_date}`).subscribe({
        next: (data) => {
          resolve(data.data);
        },
        error: (err) => {
          reject (err);
        }
      })
    })
    isOwner ? console.log('Owner req was called!', ownerReq) : console.log('Not owner req was called!',notOwnerReq);
    return isOwner ? ownerReq : notOwnerReq
  }

  async createMatch (matchInfo: MatchCreation ){
    return new Promise<MatchCreationResponse>((resolve, reject) => {
      this.http.post<MatchCreationResponse>(`${Config.apiBaseUrl}/matches/create`, matchInfo).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err);
        }
      })
    })
  }

  async deleteMatch(matchID: string){
    return new Promise<MatchDeletionResponse>((resolve, reject) => {
      this.http.delete<MatchDeletionResponse>(`${Config.apiBaseUrl}/matches/delete/${matchID}`).subscribe({
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
