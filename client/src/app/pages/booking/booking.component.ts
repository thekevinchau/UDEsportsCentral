import { NgIf, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TuiDay, TuiTime, TUI_DEFAULT_MATCHER, TuiLet } from '@taiga-ui/cdk';
import { tuiDateFormatProvider, TuiDataList, TuiInitialsPipe, TuiButton, tuiNumberFormatProvider } from '@taiga-ui/core';
import { TuiInputDateTimeModule, TuiInputModule, TuiInputNumberModule, tuiInputNumberOptionsProvider, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import type { Observable } from 'rxjs';
import { map, of, startWith, switchMap } from 'rxjs';
import { BookingService } from '../../services/booking.service';

const TeamsData = [
  'Valorant Varsity',
  'Valorant Academy',
  'Valorant Sphinx Varsity',
  'Valorant Sphinx Academy',
  'Overwatch Varsity',
  'Overwatch Academy',
  'Overwatch Phoenix Varsity',
  'Overwatch Phoenix Academy',
  'League of Legends Varsity',
  'League of Legends Academy',
  'Rocket League Varsity',
  'Rocket League Academy',
];

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    TuiInputDateTimeModule,
    TuiInputModule,
    NgIf,  // Keep only if conditional rendering is used elsewhere
    TuiButton,
    TuiTextfieldControllerModule, 
    ReactiveFormsModule, 
    TuiInputDateTimeModule,
    TuiDataList,
    TuiInputModule,
    TuiLet,
    TuiButton,
    TuiInputNumberModule, 
    TuiTextfieldControllerModule,
    CommonModule
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiDateFormatProvider({mode: 'MDY', separator: '/'}),
  ],
})

export class BookingComponent {
  isLoggedIn: string | null;
  isAdmin: string | null;

  constructor (private _bookingService: BookingService) {
    this.isLoggedIn = localStorage.getItem("isLoggedIn");
    this.isAdmin = localStorage.getItem("isAdmin");
  }

  private getCurrentDateTime(): [TuiDay, TuiTime] {
    const now = new Date();
    const currentDay = new TuiDay(now.getFullYear(), now.getMonth(), now.getDate());
    const currentTime = new TuiTime(now.getHours(), now.getMinutes());
    return [currentDay, currentTime];
  }

  protected convertToDate(day: TuiDay, time: TuiTime): Date {
    return new Date(day.year, day.month, day.day, time.hours, time.minutes);
  }
  
  // Starting values for all reservation parts. 
	protected startTimeControl = new FormControl(
    this.getCurrentDateTime()
  );
  protected endTimeControl = new FormControl(
    this.getCurrentDateTime()
  );
  protected computersControl = new FormControl('');
  protected reasonControl = new FormControl('');

  // Team Control Stuff
  protected readonly teamControl = new FormControl('');

  protected readonly teams$ = this.teamControl.valueChanges.pipe(
    startWith(''),
    switchMap((value) =>
        this.teamsRequest(value ?? '').pipe(
            map((response) => {
                if (
                    response.length === 1 &&
                    response[0] &&
                    String(response[0]) === value
                ) {
                    return [];
                }

                return response;
            }),
        ),
    ),
    startWith(TeamsData),
  );

  private teamsRequest(query: string): Observable<string[]> {
    return of(TeamsData.filter((item) => TUI_DEFAULT_MATCHER(item, query)));
  }

  protected submit(): void {

    if (
      !this.startTimeControl.value ||
      !this.endTimeControl.value ||
      !this.computersControl.value ||
      !this.reasonControl.value || 
      !this.teamControl.value
    ) {
      console.error("All fields must be filled out!");
      return;
    }
  
    const startDateTime = this.startTimeControl.value;
    const endDateTime = this.endTimeControl.value;

    
  
    const start_time = new Date(
      startDateTime[0].toLocalNativeDate().setHours(
        startDateTime[1].hours,
        startDateTime[1].minutes
      )
    );
    const end_time = new Date(
      endDateTime[0].toLocalNativeDate().setHours(
        endDateTime[1].hours,
        endDateTime[1].minutes
      )
    );
  
    // The reservation that we are going to push to the database
    const reservation = {
      _id: '',
      owner: localStorage.getItem('userID'),
      team_name: this.teamControl.value,
      start_time: this.convertToDate(startDateTime[0], startDateTime[1]), //Date
      end_time: this.convertToDate(endDateTime[0], endDateTime[1]), //  Date
      room: 'none',
      computers: this.computersControl.value,
      reason: this.reasonControl.value,
      approved: false,
    };
    
    console.log(reservation)
    // Push the reservation to booking.service.ts
    this._bookingService.createReservation(reservation).then(
      (response: any) => {
        console.log("Reservation successfully created:", response);
      },
      (error: any) => {
        console.error("Failed to create reservation:", error);
      }
    );
    setTimeout(() => {
      window.location.reload();
  }, 20);
  }
}
