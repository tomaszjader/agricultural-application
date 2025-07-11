import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WeatherData {
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
  };
  sys: {
    sunset: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly city = 'Warszawa';

  constructor(private http: HttpClient) {}

  getWeatherData(): Observable<WeatherData> {
    return this.http.get<WeatherData>(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${environment.weatherApiKey}`
    );
  }

  convertKelvinToCelsius(kelvin: number): number {
    return Number((kelvin - 273.15).toFixed(0));
  }
}