import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, ChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'TVS Dealership Management System';
}
