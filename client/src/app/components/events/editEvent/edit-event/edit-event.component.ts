import { Component, inject } from '@angular/core';
import { EventsService } from '../../../../services/events.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EventCreation } from '../../../../models/events';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.scss'
})
export class EditEventComponent {
  constructor(private eventsService: EventsService){
  }
  dialogRef = inject(MatDialogRef<EditEventComponent>);
  data = inject<{
    id: string
  }>(MAT_DIALOG_DATA)
  public eventForm = new FormGroup({
    eventName: new FormControl(''),
    description: new FormControl(''),
    location: new FormControl(''),
    date: new FormControl(),
  })

  async submitForm() {
    const body: { [key: string]: any } = {}; // Define a dynamic object type
  
    // Dynamically add keys based on form values
    if (this.eventForm.value.eventName) {
      body['eventName'] = this.eventForm.value.eventName;
    }
    if (this.eventForm.value.description) {
      body['description'] = this.eventForm.value.description;
    }
    if (this.eventForm.value.location) {
      body['location'] = this.eventForm.value.location;
    }

    if (this.eventForm.value.date){
      const castedDate = new Date(this.eventForm.value.date);
      const updatedDate = new Date(castedDate.getTime() - 5 * 60 * 60 * 1000);
      body['date'] = updatedDate
    }
  
    // Call the service with the dynamic object
    try{
      await this.eventsService.editEvent(this.data.id, body);
      window.location.reload();
    }catch(err){
      console.error(err);
    }

  }
}
