import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Config } from '../config';
import { Head, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { UserLoginModule } from '../modules/users/users.module';

interface TokenResponseObject {
  token: string;
}

export let headers = new HttpHeaders({
  'Authorization': "Bearer " + (Config.token),
})

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnInit {

  constructor(private httpClient: HttpClient, private _router:Router) { 
    this.loggedIn.next(this.token.length > 0);
  }
  /* *********************************NOTE*********************************/
  /* These method is used to get/set the token from/to local storage.     */
  /* By using localstorage we can persist the token across page reloads.  */
  /* and short intervals (based on token expiration time).                */
  /* *********************************NOTE*********************************/
  public get token(): string {
    return localStorage.getItem('token') || '';
  }

  public set token(value: string) {
    localStorage.setItem('token', value);
    Config.token = value;
    this.loggedIn.next(value.length > 0);
  }

  public get isLoggedIn(): string {
    return localStorage.getItem('isLoggedIn') || '';
  }

  public set isLoggedIn(value: boolean) {
    localStorage.setItem('isLoggedIn', value.toString());
  }

  public get headers(): HttpHeaders {
    return headers;
  }

  public loggedIn: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  public getUser(): Promise<UserLoginModule> {
    return new Promise((resolve, reject) => {
      console.log(headers);
      this.httpClient.get<UserLoginModule>(Config.apiBaseUrl, { headers: { 'Authorization': `Bearer ${Config.token}`} }).subscribe({
        next: (response) => {
          console.log(response.user.teamName);
          console.log(response.user.isAdmin.toString())
          localStorage.setItem("userName", response.user.teamName);
          localStorage.setItem("isAdmin", response.user.isAdmin.toString());
          localStorage.setItem("userID", response.user.userID);
          this._router.navigate(["/home"]);
          resolve(response);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  //verifies the token with the server and refreshes it.
  public async authorize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<TokenResponseObject>(Config.apiBaseUrl + '/security/authorize').subscribe({
        next: (response) => {
          this.token = response.token;
          resolve(response.token.length > 0);
        },
        error: (error) => {
          reject(error);
        }
      });
    }); 
  }

  /* *********************************NOTE*********************************/
  /* This method returns a promise so that we can use the async/await     */
  /* pattern in the component.  httpClient returns an observable, which   */
  /* would require us to subscribe to it in the component.                */
  /* for simpplicity, we are just returning the promise.                  */
  /* *********************************NOTE*********************************/
  public login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.post<TokenResponseObject>(Config.apiBaseUrl+"/auth", { username: username, password: password }).subscribe({
        next: (response) => {
          if (response.token && response.token.length > 0) {
            this.token = response.token
            localStorage.setItem('token', this.token);
            localStorage.setItem('isLoggedIn', "true");
            localStorage.setItem("refreshPage", "false");
            this.getUser();
            //this._router.navigate(["/home"]);
            //this.delay(5000);
            //this.reloadPage();
            resolve(true);
          } else {
            this.token = "";
            resolve(false);
          }
        },
        error: (error) => {
          this.token="";
          console.error(error);
          reject(error);
        }
      });
    });
  }

  public logout(): void {
    this.token = '';
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.setItem("isAdmin", "false");
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("refreshPage", "true");
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userID');
    location.reload();
    this._router.navigate(["/home"]);
    //this.delay(5000);
    //this.reloadPage();
  }

  public async register(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.post<TokenResponseObject>(Config.apiBaseUrl+"/auth", { username: username, password: password }).subscribe({
        next: (response) => {
          if (response.token && response.token.length > 0) {
            this.token = response.token;
            this._router.navigate(['/home']);
            this.reloadPage();
            resolve(true);
          } else {
            this.token = "";
            resolve(false);
          }
        },
        error: (error) => {
          this.token="";
          console.error(error);
          reject(error);
        }
      });
    });
  }

  ngOnInit(): void {
  }

  reloadPage(){
    window.location.reload();
  }

  public delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}