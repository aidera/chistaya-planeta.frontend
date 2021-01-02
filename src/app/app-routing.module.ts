import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './pages/order/order.component';
import { UiComponent } from './pages/ui/ui.component';
import { SimpleLayoutComponent } from './layouts/simple-layout/simple-layout.component';

const routes: Routes = [
  { path: 'ui', component: UiComponent },
  {
    path: '',
    component: SimpleLayoutComponent,
    children: [
      { path: '', redirectTo: '/order', pathMatch: 'full' },
      { path: 'order', component: OrderComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
