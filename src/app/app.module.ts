import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';

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
import { AddOrderNoAuthComponent } from './pages/add-order-no-auth/add-order-no-auth.component';
import { SimpleLayoutComponent } from './layouts/simple-layout/simple-layout.component';
import { OrderSucceedComponent } from './pages/order-succeed/order-succeed.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { RestorePasswordComponent } from './pages/restore-password/restore-password.component';
import { AuthNotifyComponent } from './components/auth-notify/auth-notify.component';
import { NgrxModule } from './store/ngrx.module';
import { CabinetLayoutComponent } from './layouts/cabinet-layout/cabinet-layout.component';
import { OrdersComponent } from './pages/cabinet/orders/orders.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MenuLinkComponent } from './components/menu-link/menu-link.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { FullscreenMenuComponent } from './components/fullscreen-menu/fullscreen-menu.component';
import { TableComponent } from './components/table/table.component';
import { PhonePipe } from './pipes/phone.pipe';
import {
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { getPaginatorIntl } from './utils/paginator.settings';

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
    AddOrderNoAuthComponent,
    SimpleLayoutComponent,
    OrderSucceedComponent,
    NotFoundComponent,
    LoginComponent,
    SignUpComponent,
    RestorePasswordComponent,
    AuthNotifyComponent,
    CabinetLayoutComponent,
    OrdersComponent,
    SidebarComponent,
    MenuLinkComponent,
    MobileHeaderComponent,
    FullscreenMenuComponent,
    TableComponent,
    PhonePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    InlineSVGModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgrxModule,
    FormsModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useValue: getPaginatorIntl(),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
