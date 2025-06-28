import { Component, inject, model } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, MatDialogContent} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';

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

export interface DialogData {
  reservations: Reservation[];
}

@Component({
  selector: 'app-calendar-modal',
  standalone: true,
  imports: [FormsModule, MatDialogClose, MatDialogContent, MatIcon, CommonModule],
  templateUrl: './calendar-modal.component.html',
  styleUrl: './calendar-modal.component.scss'
})
export class CalendarModalComponent {
  readonly dialogRef = inject(MatDialogRef<CalendarModalComponent>);

  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly reservations = model(this.data.reservations);
  //readonly action = model(this.data.action);

  constructor(private _bookingSvc: BookingService) {}

  time(date: Date): string {
    const newDate = new Date(date);
    return newDate.toLocaleTimeString();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteReservation(reservation: Reservation): void {
    this._bookingSvc.deleteReservation(reservation);
    this.onNoClick();
  }
}
