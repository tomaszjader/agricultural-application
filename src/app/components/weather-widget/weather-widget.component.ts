import { Component, OnInit } from '@angular/core';
import { WeatherService, WeatherData } from '../../services/weather.service';

interface ProcessedWeatherData extends WeatherData {
  sunset_time: string;
  isDay: boolean;
  temp_celcius: string;
  temp_min: string;
  temp_max: string;
  temp_feels_like: string;
}

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss']
})
export class WeatherWidgetComponent implements OnInit {
  WeatherData!: ProcessedWeatherData;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.WeatherData = {
      main: {
        temp: 0,
        temp_min: 0,
        temp_max: 0,
        feels_like: 0,
        humidity: 0
      },
      sys: {
        sunset: 0
      },
      name: '',
      isDay: true,
      sunset_time: '',
      temp_celcius: '0',
      temp_min: '0',
      temp_max: '0',
      temp_feels_like: '0'
    };
    this.getWeatherData();
  }

  getWeatherData() {
    this.weatherService.getWeatherData().subscribe(data => {
      this.setWeatherData(data);
    });
  }

  setWeatherData(data: WeatherData) {
    this.WeatherData = {
      ...data,
      sunset_time: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      isDay: true,
      temp_celcius: this.weatherService.convertKelvinToCelsius(data.main.temp).toString(),
      temp_min: this.weatherService.convertKelvinToCelsius(data.main.temp_min).toString(),
      temp_max: this.weatherService.convertKelvinToCelsius(data.main.temp_max).toString(),
      temp_feels_like: this.weatherService.convertKelvinToCelsius(data.main.feels_like).toString()
    };
  }
}
