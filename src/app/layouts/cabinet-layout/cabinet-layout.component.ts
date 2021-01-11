import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
  selector: 'app-cabinet-layout',
  templateUrl: './cabinet-layout.component.html',
  styleUrls: ['./cabinet-layout.component.scss'],
})
export class CabinetLayoutComponent implements OnInit {
  public isEmployee: boolean;
  public useBacklink: boolean;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.route.snapshot) {
      this.isEmployee = this.route.snapshot.data.isEmployee;
    }
    if (this.route.firstChild) {
      this.route.firstChild.data.subscribe((data: Data) => {
        this.useBacklink = data.useBacklink;
      });
    }
  }
}
