import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ClickOutsideModule } from 'ng-click-outside';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material/material.module';
import { FormControlComponent } from './components/form-controls/form-control.component';
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
import { OrdersTableComponent } from './pages/cabinet/orders/orders-table/orders-table.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MenuLinkComponent } from './components/menu-link/menu-link.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { FullscreenMenuComponent } from './components/fullscreen-menu/fullscreen-menu.component';
import { TableComponent } from './components/table/table.component';
import { PhonePipe } from './pipes/phone.pipe';
import { getPaginatorIntl } from './utils/paginator.settings';
import { AccordionComponent } from './components/accordion/accordion.component';
import { DivisionsTableComponent } from './pages/cabinet/divisions/divisions-table/divisions-table.component';
import { LocalitiesTableComponent } from './pages/cabinet/localities/localities-table/localities-table.component';
import { DateTimeInputComponent } from './components/form-controls/date-time-input/date-time-input.component';
import { TablePageComponent } from './pages/cabinet/table-page.component';
import { LocalityItemComponent } from './pages/cabinet/localities/locality-item/locality-item.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { ItemPageComponent } from './pages/cabinet/item-page.component';
import { LocalityItemAddComponent } from './pages/cabinet/localities/locality-item-add/locality-item-add.component';
import { ItemAddPageComponent } from './pages/cabinet/item-add-page.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    FormControlComponent,
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
    OrdersTableComponent,
    SidebarComponent,
    MenuLinkComponent,
    MobileHeaderComponent,
    FullscreenMenuComponent,
    TableComponent,
    PhonePipe,
    AccordionComponent,
    DivisionsTableComponent,
    LocalitiesTableComponent,
    DateTimeInputComponent,
    TablePageComponent,
    LocalityItemComponent,
    SkeletonComponent,
    ItemPageComponent,
    LocalityItemAddComponent,
    ItemAddPageComponent,
    ModalComponent,
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
    ClickOutsideModule,
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
