import { Component, inject, model } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, MatDialogContent} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

export interface DialogData {
  action: string;
  message: string;
}

@Component({
  selector: 'app-create-announcement',
  standalone: true,
  imports: [FormsModule, MatDialogClose, MatDialogContent],
  templateUrl: './create-announcement.component.html',
  styleUrl: './create-announcement.component.scss'
})
export class CreateAnnouncementComponent {
  readonly dialogRef = inject(MatDialogRef<CreateAnnouncementComponent>);

  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly message = model(this.data.message);
  readonly action = model(this.data.action);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
