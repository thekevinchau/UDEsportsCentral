import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Config } from '../config';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

interface Reservation { 
  _id: string;
  owner: string | null;
  team_name: string;
  start_time: Date;
  end_time: Date; 
  room: string; 
  computers: string;
  reason: string;
  approved: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private httpClient: HttpClient, private _loginSvc: LoginService) { }

  public createReservation(reservation: Reservation): Promise<Reservation> {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    console.log('Reservation object:', reservation);
    return new Promise((resolve, reject) => {
      this.httpClient.post<Reservation>(Config.apiBaseUrl + "/reservations/create", reservation, {headers}).subscribe({
        next: (response) => {
          console.log("Created Reservation");
          resolve(response);
        },
        error: (error) => {
          console.error("Error creating reservation:", error);
          reject(error);
        }
      });
    });
  }
  

  public getReservation(): Promise<Reservation[]> {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    return new Promise((resolve, reject) => {
      this.httpClient.get<Reservation[]>(Config.apiBaseUrl + "/reservations", {headers}).subscribe({
        next: (response) => {
          console.log("Getting Reservation(s)");
          console.log(response);
          resolve(response);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  public getAllReservation(): Promise<Reservation[]> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<Reservation[]>(Config.apiBaseUrl + "/reservations/all").subscribe({
        next: (response) => {
          console.log("Getting Reservation(s)");
          console.log(response);
          resolve(response);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  public editReservation(reservation: Reservation, approval: boolean): Promise<Reservation> {
    return new Promise((resolve, reject) => {
      const id = reservation._id;
      const start_time = reservation.start_time;
      const end_time = reservation.end_time;

      this.httpClient.put<Reservation>(Config.apiBaseUrl + "/reservations/edit?id=" + reservation._id , { id: id, approved: approval, start_time: start_time, end_time: end_time }).subscribe({
        next: (response) => {
          if(approval) console.log("Approved Reservation");
          else console.log("Declined Reservation");
          resolve(response);
        },
        error: (error) => {
          reject();
        }
      });
    });
  }

  public deleteReservation(reservation: Reservation): Promise<Reservation> {
    return new Promise((resolve, reject) => {
      this.httpClient.delete<Reservation>(Config.apiBaseUrl + "/reservations/delete/" + reservation._id).subscribe({
        next: (response) => {
          console.log("Deleted Reservation")
          resolve(response);
        },
        error: (error) => {
          reject();
        }
      });
    });
  }
}
