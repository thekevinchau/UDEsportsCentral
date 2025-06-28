import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink,MatCardModule,MatFormFieldModule,MatButtonModule,MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public disableLogin: boolean = false;
  public errorMsg: string = "";
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(
    private _loginSvc: LoginService,
    private router: Router
  ) { }

  async login() {
    if (!this.loginForm.valid) {
      return;
    }
    this.errorMsg="";
    this.disableLogin=true;
    const username=this.loginForm.get("username")?.value;
    const password=this.loginForm.get("password")?.value;
    console.log(username, password);
    if (username && password){
    const result=await this._loginSvc.login(username,password);
    if (result){
      //this.router.navigate(["/home"]);
    }
    this.errorMsg="Invalid login";
    this.disableLogin=false;
    }


  }

}
