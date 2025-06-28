import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMatch } from '../../../../models/matches';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-dialog.component.html',
  styleUrl: './match-dialog.component.scss'
})
export class MatchDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
  }
}
