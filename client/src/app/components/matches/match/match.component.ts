import { Component, Input} from '@angular/core';
import { IMatch } from '../../../models/matches';
import { MatchesService } from '../../../services/matches.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatchDialogComponent } from '../match-dialog/match-dialog/match-dialog.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './match.component.html',
  styleUrl: './match.component.scss'
})
export class MatchComponent {
  constructor(private matchService: MatchesService, private matDialog: MatDialog){}  
  userID = localStorage.getItem('userID');
  @Input() sizing: string = '';
  @Input() match: IMatch = {
    teams: {
      home: "",
      opponent: ""
    },
    score: {
      homeScore: 0,
      opponentScore: 0
    },
    match_logistics: {
      game_time: '',
      stream_url: "",
      match_urls: [""],
    },
    status: "",
    _id: ""
  }
  public gameDate: string = '';
  public gameTime: string = '';
  public teamName: string = '';
  public isAdmin = localStorage.getItem('isAdmin') === "true"
  public currentStyle = {};


  ngOnChanges(): void {
      this.currentStyle = this.setStyle(this.match.status);
  }
  
  async ngOnInit() {
    this.teamName = await this.matchService.getHomeTeamName(this.match.teams.home)
  }

  openDialog(){
    this.matDialog.open(MatchDialogComponent, {
      width: '800px',
      height: '600px',
      data: {
        match: this.match,
        gameDate: this.gameDate,
        gameTime: this.gameTime,
        teamName: this.teamName
      }
    })
  }

  private setStyle (gameStatus: string){
    if (gameStatus === "In Progress"){
      return {backgroundColor: 'red'};
    }
    else if (gameStatus === "Finished"){
      return {backgroundColor: 'green'};
    }
    else if (gameStatus === "Scheduled"){
      return {backgroundColor: 'orange'}
    }
    else{
      return {backgroundColor: 'blue'};
    }
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
    this.gameDate = `${parsedDate.month} ${parsedDate.day}, ${parsedDate.year}`
    this.gameTime = parsedDate.time
  }

  async deleteMatch(){
    console.log(this.match._id)
    await this.matchService.deleteMatch(this.match._id);
    location.reload();
  }
}