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
import { LocalitiesComponent } from './pages/cabinet/test/localities/localities.component';
import { LocalityComponent } from './pages/cabinet/test/locality/locality.component';

const routes: Routes = [
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
        path: 'order',
        component: OrdersTableComponent,
        data: { useBacklink: true },
      },
      {
        path: 'divisions',
        component: DivisionsTableComponent,
        data: { useBacklink: false },
      },
      {
        path: 'localities',
        component: LocalitiesComponent,
        data: { useBacklink: false },
      },
      {
        path: 'localities/:id',
        component: LocalityComponent,
        data: { useBacklink: true },
      },
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
