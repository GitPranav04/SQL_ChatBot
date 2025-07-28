import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  dealerName = 'TVS Dealer 001';
  dealerLocation = 'Chennai, Tamil Nadu';
  
  dashboardStats = [
    { title: 'Inventory', value: '157', description: 'Total units in stock' },
    { title: 'Sales', value: '42', description: 'Units sold this month' },
    { title: 'Pending Orders', value: '18', description: 'Orders awaiting delivery' },
    { title: 'Support', value: '5', description: 'Open support tickets' }
  ];
}