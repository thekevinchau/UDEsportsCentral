import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  isLoggedIn: string | null;
  isAdmin: string | null;
  currentDate: string = '';
  teams = ["VALORANT Varsity", "VALORANT Academy", "VALORANT Sphinx", "VALORANT Sphinx Academy",
    "Overwatch Varsity", "Overwatch Academy", "Overwatch Phoenix"
  ]

  reservations: Reservation[] = []
  unapproved_reservations: Reservation[] = []

  constructor (private _bookingService: BookingService) {
    this.isLoggedIn = localStorage.getItem("isLoggedIn");
    this.isAdmin = localStorage.getItem("isAdmin");
  }

  public getAdmin() {
    this.isAdmin = localStorage.getItem("isAdmin");
  }

  private date = new Date();
  private currYear = this.date.getFullYear();
  private currMonth = this.date.getMonth();

  renderReservations() {
    let myReservations : any;
    myReservations = this.reservations

    for(const reservations of myReservations) {
      if(!reservations.approved) {
        this.unapproved_reservations.push(reservations);
      }
    }
  }

  time(date: Date): string {
    const newDate = new Date(date);
    return newDate.toLocaleTimeString();
  }

  async approveReservation(reservation: Reservation) {
    await this._bookingService.editReservation(reservation, true).then((result) => {
      if (result) {
        console.log(result);
        this.reservations = []
        this.unapproved_reservations = []
        this.ngOnInit();
      } else {
        console.log('No Reservation Found!');
      }
    })
    .catch((error) => {
      console.error('Error occurred:', error);
    });
  }

  async declineReservation(reservation: Reservation) {
    await this._bookingService.deleteReservation(reservation).then((result) => {
      if (result) {
        console.log(result);
        this.reservations = []
        this.unapproved_reservations = []
        this.ngOnInit();
      } else {
        console.log('No Reservation Found!');
      }
    })
    .catch((error) => {
      console.error('Error occurred:', error);
    });
  }

  async ngOnInit() {
      await this._bookingService.getAllReservation().
      then((result) => {
        if (result) {
          console.log(result)
          this.reservations = result;
          
        } else {
          console.log('No Reservations Found!');
        }
      })
      .catch((error) => {
        //console.error('Error occurred:', error);
      }); 
    console.log(this.reservations)

    //this.renderCalendar();
    this.renderReservations();
  }
}
