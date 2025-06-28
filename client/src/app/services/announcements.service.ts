import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Config } from '../config';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { UserLoginModule } from '../modules/users/users.module';
import { LoginService } from './login.service';

export interface Announcement {
    announcements: any,
    _id: string,
    message: string,
    createdAt: string,
    updatedAt: string,
    createdBy: string  
}

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {

  public myAnnouncements: Announcement[] | undefined;

  constructor(private httpClient: HttpClient, private _router:Router, private _loginSvc: LoginService,) { }

  public loggedIn: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  public createAnnouncements(announcement: Announcement): Promise<Announcement> {
    return new Promise((resolve, reject) => {
      const user = this._loginSvc.getUser();
      this.httpClient.post<Announcement>(Config.apiBaseUrl + '/announcements/create', { headers: this._loginSvc.headers, user: user, announcement: announcement }).subscribe({
        next: (response) => {
          console.log("Created Announcement")
          resolve(response)
        },
        error: (error) => {
          reject(error);
        }
      });
  });
}

  public getAllAnnouncements(): Promise<Announcement[]> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<Announcement>(Config.apiBaseUrl + '/announcements?search=all').subscribe({
        next: (response) => {
            const announcements: Announcement[] = [response]
            this.myAnnouncements = announcements;
            resolve(announcements);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  public updateAnnouncement(_id: string, message: string, date: string): Promise<Announcement> {
    return new Promise((resolve, reject) => {
      this.httpClient.put<Announcement>(Config.apiBaseUrl + '/announcements/edit?id=' + _id, { updatedAt: date, newMessage: message }).subscribe({
        next: (response) => {
          console.log("Updating Announcement");
          resolve(response);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  public deleteAnnouncements(_id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.delete<Announcement>(Config.apiBaseUrl + '/announcements/delete?id=' + _id, { headers: this._loginSvc.headers }).subscribe({
        next: (response) => {
          console.log("Deleting Announcement")
          //this.getAllAnnouncements();
          resolve(true)
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
}
