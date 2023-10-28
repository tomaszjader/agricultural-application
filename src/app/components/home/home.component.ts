import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  
  user$ = this.authService.curentUser$;
  constructor(public authService: AuthenticationService){}
    
  
  
}
