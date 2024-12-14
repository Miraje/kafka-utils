import { Component } from '@angular/core';
import { HomePageComponent } from 'components/pages';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HomePageComponent],
})
export class AppComponent {}
