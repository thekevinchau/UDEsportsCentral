import { Component, OnInit } from '@angular/core';
import { MatchesBoxComponent } from '../../../components/matches/matches-box/matches-box.component';
import { AddMatchComponent } from '../../../components/matches/add-match/add-match.component';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementBoxComponent } from '../../../components/announcements/announcement-box/announcement-box.component';
import { EventsContainerComponent } from '../../../components/events/events-container/events-container.component';
import { ReservationContainerComponent } from "../../../components/reservations/reservation-container/reservation-container/reservation-container.component";
import { AddEventComponent } from '../../../components/events/addEvent/add-event/add-event.component';

@Component({
  selector: 'app-userdash',
  standalone: true,
  imports: [MatchesBoxComponent, AddMatchComponent, AnnouncementBoxComponent, EventsContainerComponent, ReservationContainerComponent],
  templateUrl: './userdash.component.html',
  styleUrl: './userdash.component.scss'
})
export class UserdashComponent {
constructor(private matDialog: MatDialog){}
date: string = '12/04/2024';

incrementDate(currentDate: string): void {
  const castedDate = new Date(currentDate);
  castedDate.setDate(castedDate.getDate() + 7); // Increment by 7 days
  this.date = castedDate.toLocaleDateString(); // Format it back to the desired string format
}

decrementDate(currentDate: string): void{
  const castedDate = new Date(currentDate);
  castedDate.setDate(castedDate.getDate() - 7); // Increment by 7 days
  this.date = castedDate.toLocaleDateString(); // Format it back to the desired string format
}

incrementClick(){
  this.incrementDate(this.date);
}

decrementClick(){
  this.decrementDate(this.date);
}

openAddDialog(){
  this.matDialog.open(AddMatchComponent, {
    width: '500px',
    height: '500px'
  })
}

openAddEventDialog(){
  this.matDialog.open(AddEventComponent, {
    width: '500px',
    height: '500px'
  })
}
}