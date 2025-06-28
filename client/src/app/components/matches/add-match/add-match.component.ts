import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms'
import { MatchesService } from '../../../services/matches.service';
import { MatchCreation } from '../../../models/matches';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-match',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './add-match.component.html',
  styleUrl: './add-match.component.scss'
})
export class AddMatchComponent {
  constructor(private matchService: MatchesService) {}
  error: string = ''
  private userID = localStorage.getItem('userID') ?? '';
  public matchStates: string[] = [
    "Scheduled",
    "In-Progress",
    "Finished"
  ]
  public matchUrls: string[] = []
  public applyForm = new FormGroup({
    opponentName: new FormControl(''),
    opponentScore: new FormControl(0),
    homeScore: new FormControl(0),
    streamUrl: new FormControl(''),
    matchUrl: new FormControl(''),
    MatchDate: new FormControl(),
    MatchState: new FormControl()
  }
  )

  public submitForm(){
    const castedDate = new Date(this.applyForm.value.MatchDate);
    const updatedDate = new Date(castedDate.getTime() - 5 * 60 * 60 * 1000).toISOString();
    const applyFormData: MatchCreation = {
      teams: {
        home: this.userID,
        opponent: this.applyForm.value.opponentName ?? '',
  
      },
      score: {
        homeScore: this.applyForm.value.homeScore ?? 0,
        opponentScore: this.applyForm.value.opponentScore ?? 0
  
      },
      match_logistics: {
        match_urls: this.matchUrls,
        stream_url: this.applyForm.value.streamUrl ?? '',
        game_time: updatedDate
  
      },
      status: this.applyForm.value.MatchState
    }
    this.matchService.createMatch(applyFormData)
    location.reload();
  }


  public addToMatchUrls(){
    const date = new Date(this.applyForm.value.MatchDate);
    if (this.applyForm.value.matchUrl){

      if (this.matchUrls.includes(this.applyForm.value.matchUrl)){
        this.error = "Duplicate match link!";
        return;
      }
      this.matchUrls.push(this.applyForm.value.matchUrl);
      console.log(this.matchUrls);
      this.applyForm.value.matchUrl = "";
    }
    console.log(date);
    console.log(this.applyForm.value.MatchState)
  }
}
