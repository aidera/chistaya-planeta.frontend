import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit, AfterViewInit {
  @Input() title: string;
  @Input() isOpenInitial?: boolean;
  @ViewChild('accordionContent') accordionContentRef: ElementRef;
  public maxAccordionContentHeight: number;
  public isOpen: boolean;

  constructor() {}

  ngOnInit(): void {
    this.isOpen = !!this.isOpenInitial;
  }

  ngAfterViewInit(): void {
    this.maxAccordionContentHeight = this.accordionContentRef.nativeElement.offsetHeight;
    this.setContentMaxHeight();
  }

  public toggleIsOpen(): void {
    this.isOpen = !this.isOpen;
    this.setContentMaxHeight();
  }

  private setContentMaxHeight(): void {
    this.accordionContentRef.nativeElement.style.maxHeight = this.isOpen
      ? this.maxAccordionContentHeight + 'px'
      : '0';
  }
}
