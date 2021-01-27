import { Component, Input, Output, EventEmitter } from '@angular/core';
import { transition, trigger, style, animate } from '@angular/animations';

export type ModalAction = 'cancel' | 'resolve' | 'reject';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('background', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms ease-in-out'),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('250ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
    trigger('base', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8) translate(-50%, -50%)' }),
        animate('100ms ease-in-out'),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1) translate(-50%, -50%)' }),
        animate(
          '100ms ease-in-out',
          style({ opacity: 0, transform: 'scale(0.8) translate(-50%, -50%)' })
        ),
      ]),
    ]),
  ],
})
export class ModalComponent {
  @Input() isOpen: boolean;
  @Input() resolveButtonText?: string;
  @Input() rejectButtonText?: string;
  @Input() title?: string;
  @Input() isLoading?: boolean;

  @Output() action = new EventEmitter<ModalAction>();
}
