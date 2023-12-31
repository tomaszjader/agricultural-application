import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { EmployeesComponent } from './components/employees/employees.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { FarmlandsComponent } from './components/farmlands/farmlands.component';
import { AnimalsComponent } from './components/animals/animals.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['home']);
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent,
    ...canActivate(redirectToHome)
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectToHome)
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    ...canActivate(redirectToHome)
  },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'employees',
    component: EmployeesComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'warehouse',
    component: WarehouseComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'farmlands',
    component: FarmlandsComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'animals',
    component: AnimalsComponent,
    ...canActivate(redirectToLogin)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
