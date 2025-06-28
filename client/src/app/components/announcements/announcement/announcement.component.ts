import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Announcement } from '../announcement-box/announcement-box.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon'
import { AnnouncementBoxComponent } from '../announcement-box/announcement-box.component';

@Component({
  selector: 'announcement',
  standalone: true,
  imports: [MatMenuModule,MatIcon,CommonModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent {
  public createdAt = '';
  public updatedAt = '';
  public _id = '';
  public createdBy = '';
  public message = '';
  isAdmin: string | null;

  @Input() announcement: Announcement = {
    _id: '',
    message: "",
    createdAt: "",
    updatedAt: "",
    createdBy: "",
    announcements: undefined
  }

  constructor(private _announcementBox: AnnouncementBoxComponent) { 
    this.isAdmin = localStorage.getItem("isAdmin");
  }

  /**
   parseDateToString(date: string): void{
    const castedDate: Date = new Date(date);

    const parsedDateObj = {
      month: castedDate.toLocaleDateString('default', {month: 'long'}),
      day: castedDate.getDate(),
      year: castedDate.getFullYear()
    }
    this.createdAt = `${parsedDateObj.month} ${parsedDateObj.day} ${parsedDateObj.year}`
    this.updatedAt = `${parsedDateObj.month} ${parsedDateObj.day} ${parsedDateObj.year}`
  }
    */
  
  public updateAnnouncement(): void {
    this._announcementBox.openEditAnnouncementDialog(this._id);
  }

  public deleteAnnouncement(): void {
    this._announcementBox.deleteAnnouncement(this._id);
  }

  ngOnInit(): void {
    if (this.announcement._id) {
      this._id = this.announcement._id;
      this.updatedAt = this.announcement.updatedAt;
      this.createdAt = this.announcement.createdAt;
      this.createdBy = this.announcement.createdBy;
      this.message = this.announcement.message;
    } else {
      console.error('No ID provided for this announcement');
    }
  }
}
