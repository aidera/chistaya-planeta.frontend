import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { ErrorsInterceptor } from './services/errors.interceptor';
import { DivisionItemComponent } from './pages/cabinet/divisions/division-item/division-item.component';
import { DivisionItemAddComponent } from './pages/cabinet/divisions/division-item-add/division-item-add.component';
import { ErrorMessageComponent } from './components/form-controls/error-message/error-message.component';
import { CarsTableComponent } from './pages/cabinet/cars/cars-table/cars-table.component';
import { NumberFromToInputComponent } from './components/form-controls/number-from-to-input/number-from-to-input.component';
import { CarItemComponent } from './pages/cabinet/cars/car-item/car-item.component';
import { CarItemAddComponent } from './pages/cabinet/cars/car-item-add/car-item-add.component';
import { EmployeesTableComponent } from './pages/cabinet/employees/employees-table/employees-table.component';
import { EmployeeItemAddComponent } from './pages/cabinet/employees/employee-item-add/employee-item-add.component';
import { EmployeeItemComponent } from './pages/cabinet/employees/employee-item/employee-item.component';
import { ItemFieldInactiveStringComponent } from './components/item-field/item-field-inactive-string/item-field-inactive-string.component';
import { ItemFieldSaveButtonComponent } from './components/item-field/item-field-save-button/item-field-save-button.component';
import { ItemFieldInactiveListComponent } from './components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import { ItemFieldInactiveStatusComponent } from './components/item-field/item-field-inactive-status/item-field-inactive-status.component';
import { ItemNotFoundComponent } from './components/item-not-found/item-not-found.component';
import { PricesComponent } from './pages/cabinet/prices/prices.component';
import { OrderItemAddComponent } from './pages/cabinet/orders/order-item-add/order-item-add.component';
import { OrderItemComponent } from './pages/cabinet/orders/order-item/order-item.component';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { IsAuthGuard } from './services/auth/is-auth.guard';
import { IsEmployeeGuard } from './services/auth/is-employee.guard';
import { IsNotAuthGuard } from './services/auth/is-not-auth.guard';
import { IsClientGuard } from './services/auth/is-client.guard';
import { IsRoleAdminGuard } from './services/auth/is-role-admin.guard';
import { IsRoleClientManagerGuard } from './services/auth/is-role-client-manager.guard';
import { IsRoleClientManagerOrDriverGuard } from './services/auth/is-role-client-manager-or-driver.guard';
import { IsRoleClientManagerOrReceivingManagerGuard } from './services/auth/is-role-client-manager-or-receiving-manager.guard';
import { IsRoleDriverGuard } from './services/auth/is-role-driver.guard';
import { IsRoleHeadGuard } from './services/auth/is-role-head.guard';
import { IsRoleReceivingManagerGuard } from './services/auth/is-role-receiving-manager.guard';
import { ProfileComponent } from './pages/cabinet/profile/profile.component';
import { TasksComponent } from './pages/cabinet/tasks/tasks.component';
import { OrderItemWeighComponent } from './pages/cabinet/orders/order-item-weigh/order-item-weigh.component';
import { ClientsTableComponent } from './pages/cabinet/clients/clients-table/clients-table.component';
import { ClientItemComponent } from './pages/cabinet/clients/client-item/client-item.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScheduledOrdersTableComponent } from './pages/cabinet/scheduled-orders/scheduled-orders-table/scheduled-orders-table.component';
import { ScheduledOrderItemAddComponent } from './pages/cabinet/scheduled-orders/scheduled-order-item-add/scheduled-order-item-add.component';
import { ScheduledOrderItemComponent } from './pages/cabinet/scheduled-orders/scheduled-order-item/scheduled-order-item.component';
import { TermsOfUseComponent } from './pages/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { DocumentsLayoutComponent } from './layouts/documents-layout/documents-layout.component';

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
    DivisionItemComponent,
    DivisionItemAddComponent,
    ErrorMessageComponent,
    CarsTableComponent,
    NumberFromToInputComponent,
    CarItemComponent,
    CarItemAddComponent,
    EmployeesTableComponent,
    EmployeeItemAddComponent,
    EmployeeItemComponent,
    ItemFieldInactiveStringComponent,
    ItemFieldSaveButtonComponent,
    ItemFieldInactiveListComponent,
    ItemFieldInactiveStatusComponent,
    ItemNotFoundComponent,
    PricesComponent,
    OrderItemAddComponent,
    OrderItemComponent,
    ProfileComponent,
    TasksComponent,
    OrderItemWeighComponent,
    ClientsTableComponent,
    ClientItemComponent,
    FooterComponent,
    ScheduledOrdersTableComponent,
    ScheduledOrderItemAddComponent,
    ScheduledOrderItemComponent,
    TermsOfUseComponent,
    PrivacyPolicyComponent,
    DocumentsLayoutComponent,
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
    IsAuthGuard,
    IsNotAuthGuard,
    IsEmployeeGuard,
    IsClientGuard,
    IsRoleAdminGuard,
    IsRoleClientManagerGuard,
    IsRoleClientManagerOrDriverGuard,
    IsRoleClientManagerOrReceivingManagerGuard,
    IsRoleDriverGuard,
    IsRoleHeadGuard,
    IsRoleReceivingManagerGuard,
    {
      provide: MatPaginatorIntl,
      useValue: getPaginatorIntl(),
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
