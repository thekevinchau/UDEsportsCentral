import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { BookingComponent } from './pages/booking/booking.component';
import { MatchesComponent } from './pages/matches/matches.component';
import { AuthGuardService } from './guards/auth.guard';
import { UserdashComponent } from './pages/userdash/userdash/userdash.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home', component: HomeComponent},
    {path:'login', component: LoginComponent},
    {path:'signup', component: SignupComponent},
    {path:'calendar', component: CalendarComponent},
    {path:'booking', component: BookingComponent},
    {path:'matches', component: MatchesComponent},
    {path:'userDash', component: UserdashComponent},
    {path:'admin', component: AdminComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }