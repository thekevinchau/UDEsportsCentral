import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogActions} from '@angular/material/dialog';
import { Config } from '../../../config'
import { AnnouncementComponent } from '../announcement/announcement.component';
import { LoginService } from '../../../services/login.service';
import { AnnouncementsService } from '../../../services/announcements.service';
import { CreateAnnouncementComponent } from '../create-announcement/create-announcement.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

export interface Announcement {
  announcements:  any,
  _id: string,
  message: string,
  //footer: string,
  createdAt: string,
  updatedAt: string,
  createdBy: string
}

@Component({
  selector: 'announcement-box',
  standalone: true,
  imports: [CommonModule, AnnouncementComponent, CreateAnnouncementComponent,ScrollingModule],
  templateUrl: './announcement-box.component.html',
  styleUrl: './announcement-box.component.scss'
})

export class AnnouncementBoxComponent {
  isLoggedIn: string | null;
  isAdmin: string | null;

  readonly message = signal("");
  //readonly footer = signal("");

  constructor(private _loginSvc: LoginService, private _announcementSvc: AnnouncementsService, private dialog: MatDialog) { 
    this.isLoggedIn = localStorage.getItem("isLoggedIn");
    this.isAdmin = localStorage.getItem("isAdmin");
  }

  public getAdmin() {
    this.isAdmin = localStorage.getItem("isAdmin");
  }

  openCreateAnnouncementDialog(): void {
    const dialogRef = this.dialog.open(CreateAnnouncementComponent, {
      width: '700px',
      //height: '500px',
      data: {action: "Create", message: this.message()},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(typeof result === 'string') {
        const date = this.getDate();
        const newAnnouncement = this.createNewAnnouncement(result);
        const createdAnnouncement = this._announcementSvc.createAnnouncements(newAnnouncement);
        if(createdAnnouncement != null) {
          createdAnnouncement.then((result) => {
          if (result) {
              this.createAnnouncement(
                result._id,
                result.createdBy,
                result.message,
                result.createdAt,
                result.updatedAt
              )
            }
          })
        }
      }
    });
  }

  openEditAnnouncementDialog(_id: string): void {
    const dialogRef = this.dialog.open(CreateAnnouncementComponent, {
      width: '700px',
      //height: '500px',
      data: {action: "Update", message: this.message()},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(typeof result === 'string') {
        const date = this.getDate();
        const createdAnnouncement = this._announcementSvc.updateAnnouncement(_id, result, date);
        if(createdAnnouncement != null) {
          createdAnnouncement.then((result) => {
          if (result) {
            const newAnnouncementList = this.announcements;
            this.announcements = [];
            for(const announcement of newAnnouncementList) {
              if(announcement._id != _id) {
                  this.createAnnouncement(
                    announcement._id,
                    announcement.createdBy,
                    announcement.message,
                    announcement.createdAt,
                    announcement.updatedAt
                  )
                } else {
                  this.createAnnouncement(
                    result._id,
                    result.createdBy,
                    result.message,
                    result.createdAt,
                    result.updatedAt
                  )
                }
              }
            }
          })
        }
      }
    });
  }

  public createNewAnnouncement(message: string): Announcement {
    let name = localStorage.getItem("userName")
    if(name == null) name = "";    

    const date = this.getDate();

    const newAnnouncement = {
      announcements: null,
      _id: "0",
      message: message,
      //footer: footer,
      createdAt: date,
      updatedAt: date,
      createdBy: name,
    };
    
    return newAnnouncement;
  }

  public createAnnouncement(id: string, createdBy: string, message: string, createdAt: string, updatedAt: string): void {
    const newAnnouncement = {
      announcements: null,
      _id: id,
      message: message,
      //footer: footer,
      createdAt: createdAt,
      updatedAt: updatedAt,
      createdBy: createdBy,
    };  
    this.announcements.push(newAnnouncement);
  }

  public deleteAnnouncement(id: string) {
    console.log(id);
    this._announcementSvc.deleteAnnouncements(id);
    const newAnnouncementList = this.announcements;
    this.announcements = [];
    for(const announcement of newAnnouncementList) {
      console.log(announcement);
      if(announcement._id != id) {
          this.createAnnouncement(
            announcement._id,
            announcement.createdBy,
            announcement.message,
            announcement.createdAt,
            announcement.updatedAt
          )
        }
      }
    }

  public getDate(): string {
    const castedDate = new Date();
    const parsedDateObj = {
      month: castedDate.toLocaleDateString('default', {month: 'long'}),
      day: castedDate.getDate(),
      year: castedDate.getFullYear()
    }
    const createdAt = `${parsedDateObj.month} ${parsedDateObj.day} ${parsedDateObj.year}`
    //const updatedAt = `${parsedDateObj.month} ${parsedDateObj.day} ${parsedDateObj.year}`

    return createdAt;
  }

  async ngOnInit(): Promise<void> {
    await this._announcementSvc.getAllAnnouncements().
    then((result) => {
      if (result) {
        this.announcements = [];
        const announcements = result[0]
        for(const announcement of announcements['announcements']) {
          this.createAnnouncement(
            announcement._id,
            announcement.createdBy,
            announcement.message,
            announcement.createdAt,
            announcement.updatedAt
          )
        }
      } else {
        console.log('No Announcements Found!');
      }
    })
    .catch((error) => {
      console.error('Error occurred:', error);
    });
  }

  announcements: Announcement[] = []

  //announcements = Array.from({length: 100000}).map((_, i) => i);

  url = Config.apiBaseUrl;
}
