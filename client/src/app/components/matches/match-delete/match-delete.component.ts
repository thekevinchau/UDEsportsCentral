import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-match-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-delete.component.html',
  styleUrl: './match-delete.component.scss'
})
export class MatchDeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
  }
}
