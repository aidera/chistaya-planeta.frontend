import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  public isEmployee: boolean;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.route.parent) {
      this.isEmployee = this.route.parent.snapshot.data.isEmployee;
    }
  }
}
