import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { PacientesComponent } from './components/turnos/pacientes/pacientes.component';
import { EspecialistasComponent } from './components/turnos/especialistas/especialistas.component';
import { AdminComponent } from './components/turnos/admin/admin.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'turnoPaciente', component: PacientesComponent },
    { path: 'turnosEspecialistas', component: EspecialistasComponent },
    { path: 'turnoAdmin', component: AdminComponent },
];