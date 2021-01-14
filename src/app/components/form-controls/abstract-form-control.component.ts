import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  template: '',
})
export class AbstractFormControlComponent implements DoCheck {
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
