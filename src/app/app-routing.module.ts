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
import { IsEmployeeGuard } from './services/auth/is-employee.guard';
import { IsNotAuthGuard } from './services/auth/is-not-auth.guard';
import { IsClientGuard } from './services/auth/is-client.guard';
import { ProfileComponent } from './pages/cabinet/profile/profile.component';
import { TasksComponent } from './pages/cabinet/tasks/tasks.component';
import { OrderItemWeighComponent } from './pages/cabinet/orders/order-item-weigh/order-item-weigh.component';

export const routes: Routes = [
  {
    path: 'e/cabinet',
    component: CabinetLayoutComponent,
    data: { isEmployee: true },
    canActivate: [IsEmployeeGuard],
    canActivateChild: [IsEmployeeGuard],
    children: [
      { path: '', redirectTo: '/e/cabinet/tasks', pathMatch: 'full' },

      { path: 'orders', component: OrdersTableComponent },
      { path: 'orders/add', component: OrderItemAddComponent },
      { path: 'orders/weigh/:id', component: OrderItemWeighComponent },
      { path: 'orders/:id', component: OrderItemComponent },

      { path: 'localities', component: LocalitiesTableComponent },
      { path: 'localities/add', component: LocalityItemAddComponent },
      { path: 'localities/:id', component: LocalityItemComponent },

      { path: 'divisions', component: DivisionsTableComponent },
      { path: 'divisions/add', component: DivisionItemAddComponent },
      { path: 'divisions/:id', component: DivisionItemComponent },

      { path: 'cars', component: CarsTableComponent },
      { path: 'cars/add', component: CarItemAddComponent },
      { path: 'cars/:id', component: CarItemComponent },

      { path: 'employees', component: EmployeesTableComponent },
      { path: 'employees/add', component: EmployeeItemAddComponent },
      { path: 'employees/:id', component: EmployeeItemComponent },

      { path: 'prices', component: PricesComponent },

      { path: 'profile', component: ProfileComponent },

      { path: 'tasks', component: TasksComponent },

      { path: '**', component: ItemNotFoundComponent },
    ],
  },
  {
    path: 'e',
    component: SimpleLayoutComponent,
    data: { isEmployee: true },
    children: [
      { path: '', redirectTo: '/e/login', pathMatch: 'full' },
      {
        path: 'login',
        canActivate: [IsNotAuthGuard],
        component: LoginComponent,
      },
    ],
  },
  {
    path: 'cabinet',
    component: CabinetLayoutComponent,
    data: { isEmployee: false },
    canActivate: [IsClientGuard],
    canActivateChild: [IsClientGuard],
    children: [
      { path: 'orders', component: OrdersTableComponent },
      { path: 'order', component: OrdersTableComponent },
    ],
  },
  {
    path: '',
    component: SimpleLayoutComponent,
    children: [
      { path: '', redirectTo: '/order', pathMatch: 'full' },
      {
        path: 'order',
        canActivate: [IsNotAuthGuard],
        component: AddOrderNoAuthComponent,
      },
      { path: 'order-succeed', component: OrderSucceedComponent },
      {
        path: 'login',
        canActivate: [IsNotAuthGuard],
        component: LoginComponent,
      },
      {
        path: 'sign-up',
        canActivate: [IsNotAuthGuard],
        component: SignUpComponent,
      },
      {
        path: 'restore-password',
        canActivate: [IsNotAuthGuard],
        component: RestorePasswordComponent,
      },
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
