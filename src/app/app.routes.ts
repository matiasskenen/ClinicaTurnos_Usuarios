import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { PacientesComponent } from './components/turnos/pacientes/pacientes.component';
import { EspecialistasComponent } from './components/turnos/especialistas/especialistas.component';
import { AdminComponent } from './components/turnos/admin/admin.component';
import { PacientePerfilComponent } from './components/perfiles/paciente/paciente-perfil/paciente-perfil.component';
import { EspecialistaPerfilComponent } from './components/perfiles/especialista/especialista-perfil/especialista-perfil.component';
import { AdminPerfilComponent } from './components/perfiles/admin/admin-perfil/admin-perfil.component';
import { SeccionusuariosComponent } from './components/seccionusuarios/seccionusuarios.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    
    { path: 'turnoPaciente', component: PacientesComponent },
    { path: 'turnosEspecialistas', component: EspecialistasComponent },
    { path: 'turnoAdmin', component: AdminComponent },

    { path: 'perfilPaciente', component: PacientePerfilComponent },
    { path: 'perfilEspecialista', component: EspecialistaPerfilComponent },
    { path: 'perfilAdmin', component: AdminPerfilComponent },

    
    {
        path: 'turnos',
        loadChildren: () => import('./components/turnos/pacientes/turnos-pacientes/turnos-pacientes.module').then(m => m.TurnosPacientesModule)
    },

    { path: 'seccionusuarios', component: SeccionusuariosComponent },
    
    
];