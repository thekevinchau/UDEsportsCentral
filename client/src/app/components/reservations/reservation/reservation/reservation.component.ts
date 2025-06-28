import { Component, Input } from '@angular/core';

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
  selector: 'app-reservation',
  standalone: true,
  imports: [],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent {
  @Input() reservation: Reservation = {
    _id: '',
    owner: 'VAL_VARSITY',
    team_name: 'VALORANT Varsity',
    start_time: new Date(),
    end_time: new Date(),
    room: '',
    computers: '',
    reason: '',
    approved: false
  }

  resDate: string = '';
  resTime: string = '';

  dateToString(date: string): void{
    const castedDate: Date = new Date(date);
    const AMorPM: string = castedDate.getUTCHours() < 12 ? 'AM': 'PM' 
    const formattedHours = ((castedDate.getUTCHours() + 11) % 12 + 1)

    const parsedDate = {
      month: castedDate.toLocaleDateString('default', {month: 'long'}),
      day: castedDate.getDate(),
      year: castedDate.getFullYear(),
      time: `${formattedHours}:${String(castedDate.getMinutes()).padStart(2, '0')} ${AMorPM}`
    }
    this.resDate = `${parsedDate.month} ${parsedDate.day}, ${parsedDate.year}`
    this.resTime = parsedDate.time
  }

  ngOnInit(){
    this.dateToString(this.reservation.start_time.toString())
  }

}
