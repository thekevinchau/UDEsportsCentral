import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Config } from '../../config';
import { AnnouncementBoxComponent } from '../../components/announcements/announcement-box/announcement-box.component';
import { MatchesBoxComponent } from "../../components/matches/matches-box/matches-box.component";
import { NavmenuComponent } from '../../components/navmenu/navmenu.component';
import { AddMatchComponent } from '../../components/matches/add-match/add-match.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { EventsContainerComponent } from '../../components/events/events-container/events-container.component';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AnnouncementBoxComponent, MatchesBoxComponent, MatDialogModule, EventsContainerComponent, TuiButton],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private matDialog: MatDialog){}

  openDialog(){
    this.matDialog.open(AddMatchComponent, {
      width: '500px',
      height: '500px'
    })
  }

  public getUser() { 
    if(localStorage.getItem("refreshPage") === "false") {
      localStorage.setItem("refreshPage", "true");
      console.log("Reloading Page");
      this.reloadPage();
    }
  }

  ngOnInit(): void {
  }

  reloadPage(){
    window.location.reload();
  }
}
