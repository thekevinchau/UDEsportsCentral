import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiStringifyContentPipe,
} from '@taiga-ui/kit';
import {TuiComboBoxModule} from '@taiga-ui/legacy';
import { MatchComponent } from '../../components/matches/match/match.component';
import { MatchesBoxComponent } from '../../components/matches/matches-box/matches-box.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-matches',
  standalone: true,
  exportAs: "MatchesComponent",
  imports: [
    FormsModule,
    TuiComboBoxModule,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiStringifyContentPipe,
    MatchesBoxComponent,
    MatchComponent,
    MatIcon,
  ],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
})
export class MatchesComponent {
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
}

