import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EventsService } from '../../../../services/events.service';
import { MatDialog } from '@angular/material/dialog';
import { EditEventComponent } from '../../editEvent/edit-event/edit-event.component';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, TuiButton],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent {
  constructor(private eventsService: EventsService, private matDialog: MatDialog){}
  @Input() event = {
    _id: '',
    eventName: '',
    date: new Date(),
    description: '',
    location: '',
    owner: ''
  }

  openEditDialog(){
    this.matDialog.open(EditEventComponent, {
      width: '500px',
      height: '500px',
      data: {
        id: this.event._id
      }
    })
  }


  userID = localStorage.getItem('userID');
  isAdmin = localStorage.getItem('isAdmin');

  eventOwner: string = '';
  eventDate: string = '';
  eventTime: string = '';
  statusMessage: string = '';

  ngOnInit(){
    this.convertIDtoString();
    this.dateToString(this.event.date.toString())
  }

  async convertIDtoString(){
    this.eventOwner = await this.eventsService.getHomeTeamName(this.event.owner)
  }


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
    this.eventDate = `${parsedDate.month} ${parsedDate.day}, ${parsedDate.year}`
    this.eventTime = parsedDate.time

  }

  async deleteEvent(){
    try{
      const response = await this.eventsService.deleteEvent(this.event._id);
      this.statusMessage = response.statusMessage;
      window.location.reload();
    }catch(err){
      console.error(err);
    }
  }
}
