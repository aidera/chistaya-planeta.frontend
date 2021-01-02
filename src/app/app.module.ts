import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material/material.module';
import { AbstractFormControlComponent } from './components/form-controls/abstract-form-control.component';
import { TextInputComponent } from './components/form-controls/text-input/text-input.component';
import { TextareaComponent } from './components/form-controls/textarea/textarea.component';
import { CheckboxComponent } from './components/form-controls/checkbox/checkbox.component';
import { SelectComponent } from './components/form-controls/select/select.component';
import { QuestionHintComponent } from './components/question-hint/question-hint.component';
import { DateInputComponent } from './components/form-controls/date-input/date-input.component';
import { UiComponent } from './pages/ui/ui.component';
import { OrderComponent } from './pages/order/order.component';
import { SimpleLayoutComponent } from './layouts/simple-layout/simple-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    AbstractFormControlComponent,
    TextInputComponent,
    TextareaComponent,
    CheckboxComponent,
    SelectComponent,
    QuestionHintComponent,
    DateInputComponent,
    UiComponent,
    OrderComponent,
    SimpleLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    InlineSVGModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
