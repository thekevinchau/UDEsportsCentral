import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { EventsService } from '../../../../services/events.service';
import { EventCreation } from '../../../../models/events';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [ReactiveFormsModule, TuiButton],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
})
export class AddEventComponent {
  constructor(private eventsService: EventsService){}

  public eventForm = new FormGroup({
    eventName: new FormControl(''),
    description: new FormControl(''),
    location: new FormControl(''),
    date: new FormControl(),
  })

  async submitForm(){
    const castedDate = new Date(this.eventForm.value.date);
    const updatedDate = new Date(castedDate.getTime() - 5 * 60 * 60 * 1000);
    const body: EventCreation = {
      eventName: this.eventForm.value.eventName ?? '',
      description: this.eventForm.value.description ?? '',
      location: this.eventForm.value.location ?? '',
      date: updatedDate
    }
    try{
      await this.eventsService.createEvent(body);
      window.location.reload();
    }
    catch(err){
      console.error(err);
    }
  }
}
