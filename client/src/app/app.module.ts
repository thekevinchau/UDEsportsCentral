import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BookingComponent } from './pages/booking/booking.component';
import { AppComponent } from './app.component';
import { TuiButton } from '@taiga-ui/core';
import { LoginButtonComponent } from './components/navmenu/login-button/login-button.component';
import { CommonModule } from '@angular/common';
import { NavmenuComponent } from './components/navmenu/navmenu.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginButtonComponent,
    NavmenuComponent
  ],
  imports: [
    TuiButton,
    BrowserModule,
    FormsModule,
    BookingComponent,
    CommonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}