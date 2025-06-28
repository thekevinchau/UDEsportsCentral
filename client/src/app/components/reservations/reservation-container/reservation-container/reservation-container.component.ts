import { Component } from '@angular/core';
import { BookingService } from '../../../../services/booking.service';
import { CommonModule } from '@angular/common';
import { ReservationComponent } from '../../reservation/reservation/reservation.component';
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
  selector: 'app-reservation-container',
  standalone: true,
  imports: [CommonModule, ReservationComponent],
  templateUrl: './reservation-container.component.html',
  styleUrl: './reservation-container.component.scss'
})
export class ReservationContainerComponent {
  constructor(private bookingService: BookingService){}

  reservations: Reservation[] = []

  async getReservations(){
      this.reservations = await this.bookingService.getReservation()
  }

  async ngOnInit(){
    await this.getReservations();
    console.log(this.reservations)
  }
}
