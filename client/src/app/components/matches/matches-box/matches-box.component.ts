import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchComponent } from '../match/match.component';
import { MatchesService } from '../../../services/matches.service';
import { IMatch } from '../../../models/matches';


@Component({
  selector: 'app-matches-box',
  standalone: true,
  imports: [CommonModule, MatchComponent],
  templateUrl: './matches-box.component.html',
  styleUrl: './matches-box.component.scss'
})
export class MatchesBoxComponent implements OnInit {
  @Input() start_date: string = '';
  @Input() matchFilter: string = '';
  @Input() sizing: string = '';
  @Input() filter: string = '';
  @Input() isOwner: boolean = false;
  userID: string = '';
  matches: IMatch[] = []; // Holds fetched matches
  loading: boolean = false; // Tracks the loading state
  error: string | null = null; // Tracks any errors

  constructor(private matchService: MatchesService) {}

  private async fetchDailyMatches(userID: string, isOwner: boolean){
    return await this.matchService.getTodayMatches(isOwner, userID);
  }

  private async fetchWeeklyMatches(userID: string, isOwner: boolean, start_date: string){
    return await this.matchService.getWeeklyMatches(isOwner, userID, start_date)
  }

  private filterFinishedMatches(matches: IMatch[]){
    const filteredMatches = matches.filter((match: IMatch) => match.status === "Finished");
    const sortedMatches = filteredMatches.sort((date1: IMatch, date2: IMatch) => 
      new Date(date1.match_logistics.game_time).getTime() - new Date(date2.match_logistics.game_time).getTime())
    return sortedMatches;
  }

  private filterUnfinishedMatches(matches: IMatch[]){
    const filteredMatches = matches.filter((match: IMatch) => match.status === "Scheduled" || match.status === "In Progress")
    const sortedMatches = filteredMatches.sort((date1: IMatch, date2: IMatch) => 
      new Date(date1.match_logistics.game_time).getTime() - new Date(date2.match_logistics.game_time).getTime())
    return sortedMatches;
  }

  private async fetchMatches(filter: string): Promise<void>{
    if (filter === 'today'){
      const fetchedMatches = await this.fetchDailyMatches(this.userID, this.isOwner)
      if (this.matchFilter === "unfinished"){
        this.matches = this.filterUnfinishedMatches(fetchedMatches)
      }
      else{
        this.matches = this.filterFinishedMatches(fetchedMatches);
      }
    }
    else if (filter === 'week'){
      const fetchedMatches = await this.fetchWeeklyMatches(this.userID, this.isOwner, this.start_date)
      if (this.matchFilter === "unfinished"){
        this.matches = this.filterUnfinishedMatches(fetchedMatches)
      }
      else{
        this.matches = this.filterFinishedMatches(fetchedMatches);
      }
    }
  }

  async ngOnInit(){
    this.userID =  this.isOwner === true ? localStorage.getItem('userID') ?? '' : ''
    await this.fetchMatches(this.filter);
    console.log('Username', localStorage.getItem('userName'))
  }

    // Called every time an @Input() property changes
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['start_date']) {
        // If start_date has changed, refetch the matches
        this.fetchMatches(this.filter);
      }
    }

}