import { Component, Input } from '@angular/core';
import { EventsService } from '../../../services/events.service';
import { IEvent } from '../../../models/events';
import { EventComponent } from "../event/event/event.component";
import { MatDialog } from '@angular/material/dialog';
import { AddEventComponent } from '../addEvent/add-event/add-event.component';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-events-container',
  standalone: true,
  imports: [EventComponent, TuiButton],
  templateUrl: './events-container.component.html',
  styleUrl: './events-container.component.scss'
})
export class EventsContainerComponent {
  constructor(private eventsService: EventsService, private matDialog: MatDialog){}

  @Input() isOwner = true
  @Input () filter = '';
  @Input () startDate = '12-04-2024';
  userID = localStorage.getItem('userID') ?? '';
  events: IEvent[] =  [];
  error: string = '';

  
  openDialog(){
    this.matDialog.open(AddEventComponent, {
      width: '500px',
      height: '500px'
    })
  }
   

  async fetchTodayEvents(){
    try{
      if (this.isOwner){
        if (this.userID){
          const request = await this.eventsService.getTodayEvents(true, this.userID);
          this.events = request.data;
        }
      }
      else {
        const request = await this.eventsService.getTodayEvents(false, '');
        this.events = request.data;
      }
    }catch(err){
      console.error(err);
    }
  }

  async fetchWeeklyEvents(){
    try{
      if (this.isOwner){
        if (this.userID){
          const request = await this.eventsService.getWeeklyEvents(true, this.userID, this.startDate);
          console.log('owner weekly this was called');
          this.events = request.data;
        }
        else{
          this.error = "You are not signed in!";
        }
      }
      else{
        const request = await this.eventsService.getWeeklyEvents(false, '', this.startDate);
        console.log('not owner weekly this was called');
        this.events = request.data;
      }
    }catch(err){
      this.error = "Error resolving matches";
    }
  }

  async ngOnInit(){
    try{
      if (this.filter === "today"){
        await this.fetchTodayEvents();
      }
      else if (this.filter === "week"){
        await this.fetchWeeklyEvents();
      }
      console.log(this.events);
    }catch(err){
      this.error = "Error retrieving events!"
    }


}
}

