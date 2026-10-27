import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { VuelosComponent } from './components/vuelos/vuelos.component';
import { AvionesComponent } from './components/aviones/aviones.component';
import { PersonalComponent } from './components/personal/personal.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'vuelos', 
    component: VuelosComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'aviones', 
    component: AvionesComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'personal', 
    component: PersonalComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['ROOT'] } 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }