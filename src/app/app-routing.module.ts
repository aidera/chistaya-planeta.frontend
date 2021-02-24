import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOrderNoAuthComponent } from './pages/add-order-no-auth/add-order-no-auth.component';
import { SimpleLayoutComponent } from './layouts/simple-layout/simple-layout.component';
import { OrderSucceedComponent } from './pages/order-succeed/order-succeed.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { RestorePasswordComponent } from './pages/restore-password/restore-password.component';
import { CabinetLayoutComponent } from './layouts/cabinet-layout/cabinet-layout.component';
import { OrdersTableComponent } from './pages/cabinet/orders/orders-table/orders-table.component';
import { DivisionsTableComponent } from './pages/cabinet/divisions/divisions-table/divisions-table.component';
import { LocalitiesTableComponent } from './pages/cabinet/localities/localities-table/localities-table.component';
import { LocalityItemComponent } from './pages/cabinet/localities/locality-item/locality-item.component';
import { LocalityItemAddComponent } from './pages/cabinet/localities/locality-item-add/locality-item-add.component';
import { DivisionItemComponent } from './pages/cabinet/divisions/division-item/division-item.component';
import { DivisionItemAddComponent } from './pages/cabinet/divisions/division-item-add/division-item-add.component';
import { CarsTableComponent } from './pages/cabinet/cars/cars-table/cars-table.component';
import { CarItemComponent } from './pages/cabinet/cars/car-item/car-item.component';
import { CarItemAddComponent } from './pages/cabinet/cars/car-item-add/car-item-add.component';
import { EmployeesTableComponent } from './pages/cabinet/employees/employees-table/employees-table.component';
import { EmployeeItemAddComponent } from './pages/cabinet/employees/employee-item-add/employee-item-add.component';
import { EmployeeItemComponent } from './pages/cabinet/employees/employee-item/employee-item.component';
import { ItemNotFoundComponent } from './components/item-not-found/item-not-found.component';
import { PricesComponent } from './pages/cabinet/prices/prices.component';
import { OrderItemAddComponent } from './pages/cabinet/orders/order-item-add/order-item-add.component';
import { OrderItemComponent } from './pages/cabinet/orders/order-item/order-item.component';

export const routes: Routes = [
  {
    path: 'e/cabinet',
    component: CabinetLayoutComponent,
    data: { isEmployee: true },
    children: [
      {
        path: 'orders',
        component: OrdersTableComponent,
        data: { useBacklink: false },
      },
      {
        path: 'orders/add',
        component: OrderItemAddComponent,
        data: { useBacklink: true },
      },
      {
        path: 'orders/:id',
        component: OrderItemComponent,
        data: { useBacklink: true },
      },
      {
        path: 'localities',
        component: LocalitiesTableComponent,
        data: { useBacklink: false },
      },
      {
        path: 'localities/add',
        component: LocalityItemAddComponent,
        data: { useBacklink: true },
      },
      {
        path: 'localities/:id',
        component: LocalityItemComponent,
        data: { useBacklink: true },
      },
      {
        path: 'divisions',
        component: DivisionsTableComponent,
        data: { useBacklink: false },
      },
      {
        path: 'divisions/add',
        component: DivisionItemAddComponent,
        data: { useBacklink: true },
      },
      {
        path: 'divisions/:id',
        component: DivisionItemComponent,
        data: { useBacklink: true },
      },
      {
        path: 'cars',
        component: CarsTableComponent,
        data: { useBacklink: false },
      },
      {
        path: 'cars/add',
        component: CarItemAddComponent,
        data: { useBacklink: true },
      },
      {
        path: 'cars/:id',
        component: CarItemComponent,
        data: { useBacklink: true },
      },
      {
        path: 'employees',
        component: EmployeesTableComponent,
        data: { useBacklink: false },
      },
      {
        path: 'employees/add',
        component: EmployeeItemAddComponent,
        data: { useBacklink: true },
      },
      {
        path: 'employees/:id',
        component: EmployeeItemComponent,
        data: { useBacklink: true },
      },
      {
        path: 'prices',
        component: PricesComponent,
        data: { useBacklink: false },
      },
      { path: '**', component: ItemNotFoundComponent },
    ],
  },
  {
    path: 'e',
    component: SimpleLayoutComponent,
    data: { isEmployee: true },
    children: [
      { path: '', redirectTo: '/e/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
    ],
  },
  {
    path: 'cabinet',
    component: CabinetLayoutComponent,
    data: { isEmployee: false },
    children: [
      {
        path: 'orders',
        component: OrdersTableComponent,
        data: { useBacklink: false },
      },
      {
        path: 'order',
        component: OrdersTableComponent,
        data: { useBacklink: true },
      },
    ],
  },
  {
    path: '',
    component: SimpleLayoutComponent,
    children: [
      { path: '', redirectTo: '/order', pathMatch: 'full' },
      { path: 'order', component: AddOrderNoAuthComponent },
      { path: 'order-succeed', component: OrderSucceedComponent },
      { path: 'login', component: LoginComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'restore-password', component: RestorePasswordComponent },
      { path: 'not-found', component: NotFoundComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
