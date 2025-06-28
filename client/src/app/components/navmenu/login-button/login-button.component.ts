import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [
    MatToolbarModule, 
    MatButtonModule, 
    RouterLink, 
    RouterLinkActive, 
    CommonModule,
  ],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.scss'
})
export class LoginButtonComponent {
  isLoggedIn: string | null;
  isAdmin: string | null;

  constructor(private _loginSvc: LoginService) { 
    this.isLoggedIn = localStorage.getItem("isLoggedIn");
    this.isAdmin = localStorage.getItem("isAdmin");
    if (this.isLoggedIn == null) {
      this.isLoggedIn = "false";
      this.isAdmin = "false";
    }
  }

  public logout(): void {
    this.isLoggedIn = "false";
    this.isAdmin = "false";
    this._loginSvc.logout();
    //this.reloadPage();
  }

  public getUser(): string | null { 
    return localStorage.getItem("userName");
  }

  ngOnInit(): void {
  }

  reloadPage(){
    window.location.reload()
  }
}

