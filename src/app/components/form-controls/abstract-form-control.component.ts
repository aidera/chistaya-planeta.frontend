import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  template: '',
})
export class AbstractFormControlComponent implements OnInit, DoCheck {
  @Input() fieldId: string;
  @Input() label?: string;
  @Input() errorMessages?: { [key: string]: string };
  @Input() isRequired?: boolean;
  @Input() labelHint?: string;
  /* for Reactive Forms */
  @Input() control?: FormControl | AbstractControl;
  /* for Template Driven Forms */
  @Input() value?: any;
  @Input() disabled?: boolean;
  @Output() valueChange = new EventEmitter<any>();

  currentErrorMessage: string | null = null;

  ngOnInit(): void {
    if (this.control && this.value !== undefined) {
      throw new Error('Should be only control or only value definer');
    }
    if (this.value === undefined && this.disabled) {
      throw new Error(
        'Disable can be only with template driven forms (with value parameter). ' +
          'For reactive forms use its form constructor'
      );
    }
  }

  ngDoCheck(): void {
    if (this.errorMessages && this.control.errors) {
      const firstError = Object.keys(this.control.errors)[0];
      if (this.errorMessages[firstError]) {
        this.currentErrorMessage = this.errorMessages[firstError];
      } else {
        this.currentErrorMessage = null;
      }
    } else {
      this.currentErrorMessage = null;
    }
  }

  onValueChange(event: any): void {
    this.valueChange.emit(event);
  }
}
