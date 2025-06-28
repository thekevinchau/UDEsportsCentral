import { Component, AfterViewInit, AfterViewChecked, ElementRef, QueryList, ViewChildren, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginButtonComponent } from './login-button/login-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navmenu',
  standalone: true,
  imports: [
    LoginButtonComponent,
    MatButtonModule,
    MatToolbarModule,
    RouterLink, 
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './navmenu.component.html',
  styleUrl: './navmenu.component.scss',
})
export class NavmenuComponent implements AfterViewInit, AfterViewChecked, OnInit {
  activeButton: 'homeBtn' | 'calendarBtn' | 'bookingBtn' | 'matchesBtn' | 'loginBtn' | 'adminBtn' | 'userdashBtn'= 'homeBtn' ;
  sliderLeft = 0;
  sliderWidth = 0;
  @ViewChildren('navButton') navButtons!: QueryList<ElementRef>;
  buttonDimensions: { [key: string]: { left: number; width: number } } = {};
  isAdmin = localStorage.getItem('isAdmin');
  isLoggedIn = localStorage.getItem('isLoggedIn')

  setActiveButton(button: 'homeBtn' | 'calendarBtn' | 'bookingBtn' | 'matchesBtn' | 'adminBtn' | 'loginBtn' | 'userdashBtn') {
    this.activeButton = button;
    this.updateSliderPosition();
  }

  ngOnInit() {
    this.setDefaultSliderPosition();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.collectButtonDimensions();
    });
  }

  ngAfterViewChecked() {
    this.collectButtonDimensions();
  }

  setDefaultSliderPosition() {
    const homeBtnDimensions = this.buttonDimensions['homeBtn'];
    if (homeBtnDimensions) {
      this.sliderLeft = homeBtnDimensions.left;
      this.sliderWidth = homeBtnDimensions.width;
    }
  }

  collectButtonDimensions() {
    const buttons = document.querySelectorAll('[id$="Btn"]');
    buttons.forEach((btn: Element) => {
      const rect = btn.getBoundingClientRect();
      this.buttonDimensions[btn.id] = { left: rect.left, width: rect.width };
    });
  }
  
  updateSliderPosition() {
    const buttonId = `${this.activeButton}`;
    const dimensions = this.buttonDimensions[buttonId];
    if (dimensions) {
      this.sliderLeft = dimensions.left;
      this.sliderWidth = dimensions.width;
    }
  }
  
}
