import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CalendarModalComponent } from '../../components/calendar-modal/calendar-modal.component';
import { MatIcon } from '@angular/material/icon';

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
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIcon],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  isLoggedIn: string | null;
  isAdmin: string | null;
  currentDate: string = '';
  teams = ["VALORANT Varsity", "VALORANT Academy", "VALORANT Sphinx", "VALORANT Sphinx Academy",
    "Overwatch Varsity", "Overwatch Academy", "Overwatch Phoenix"
  ]

  reservations: Reservation[] = []
  unapproved_reservations: Reservation[] = []

  days: Array<{ day: number, isCurrentMonth: boolean, isToday: boolean, reservations: Reservation[] }> = [];
  
  constructor (private _bookingService: BookingService, private matDialog: MatDialog) {
    this.isLoggedIn = localStorage.getItem("isLoggedIn");
    this.isAdmin = localStorage.getItem("isAdmin");
  }
  
  public getAdmin() {
    this.isAdmin = localStorage.getItem("isAdmin");
  }

  private date = new Date();
  private currYear = this.date.getFullYear();
  private currMonth = this.date.getMonth();

  private months: string[] = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  openDialog(reservations: Reservation[]){
    this.matDialog.open(CalendarModalComponent, {
      width: '900px',
      data: {reservations: reservations},
    })
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

  this.renderCalendar();
  //this.renderReservations();
}

  renderCalendar() {
    const firstDayofMonth = new Date(this.currYear, this.currMonth, 1).getDay();
    const lastDateofMonth = new Date(this.currYear, this.currMonth + 1, 0).getDate();
    const lastDateofLastMonth = new Date(this.currYear, this.currMonth, 0).getDate();

    this.days = [];
    // Gets Last Months Days
    for (let i = firstDayofMonth; i > 0; i--) {
      this.days.push({ day: lastDateofLastMonth - i + 1, isCurrentMonth: false, isToday: false, reservations: [] });
    }

    // Gets This Months Days
    for (let i = 1; i <= lastDateofMonth; i++) {
      this.date = new Date();
      const isToday = i === this.date.getDate() &&
                      this.currMonth === new Date().getMonth() &&
                      this.currYear === new Date().getFullYear();

      const thisDayReservations: Reservation[] = []
      let myReservations : any;
      myReservations = this.reservations

      for(const reservations of myReservations) {
        const startTime: Date = reservations.start_time
        if(new Date(startTime).getMonth() === this.currMonth && new Date(startTime).getDate() === i &&
          reservations.approved) {
          thisDayReservations.push(reservations);
        }
      }

      this.days.push({ day: i, isCurrentMonth: true, isToday, reservations: thisDayReservations });
    }

    // Gets Next Months Days
    const lastDayofMonth = new Date(this.currYear, this.currMonth, lastDateofMonth).getDay();
    for (let i = lastDayofMonth; i < 6; i++) {
      this.days.push({ day: i - lastDayofMonth + 1, isCurrentMonth: false, isToday: false, reservations: [] });
    }

    this.currentDate = `${this.months[this.currMonth]} ${this.currYear}`;
  }

  /**
  renderReservations() {
    let myReservations : any;
    myReservations = this.reservations[0]

    for(const reservations of myReservations) {
      if(!reservations.approved) {
        this.unapproved_reservations.push(reservations);
      }
    }
  }
    */

  time(date: Date): string {
    const newDate = new Date(date);
    return newDate.toLocaleTimeString();
  }

  changeMonth(isNext: boolean) {
    this.currMonth = isNext ? this.currMonth + 1 : this.currMonth - 1;
    if (this.currMonth < 0 || this.currMonth > 11) {
      this.date = new Date(this.currYear, this.currMonth);
      this.currYear = this.date.getFullYear();
      this.currMonth = this.date.getMonth();
    }
    this.renderCalendar();
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
}
