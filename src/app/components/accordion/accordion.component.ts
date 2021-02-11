import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {
  @Input() title: string;
  @Input() isOpenInitial?: boolean;
  @ViewChild('accordionContent') accordionContentRef: ElementRef;
  public maxAccordionContentHeight: number;
  public isOpen: boolean;

  constructor() {}

  ngOnInit(): void {
    this.isOpen = this.isOpenInitial;
  }

  public toggleIsOpen(): void {
    this.isOpen = !this.isOpen;
  }
}
