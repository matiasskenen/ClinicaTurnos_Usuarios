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
import { PacientesAtendidosComponent } from './components/pacientes-atendidos/pacientes-atendidos.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full', data: { animation: 'HomePage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'home', component: HomeComponent, data: { animation: 'HomePage' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'RegisterPage' } },
  { path: 'turnoPaciente', component: PacientesComponent, data: { animation: 'PacientesPage' } },
  { path: 'turnosEspecialistas', component: EspecialistasComponent, data: { animation: 'EspecialistasPage' } },
  { path: 'turnoAdmin', component: AdminComponent, data: { animation: 'AdminPage' } },
  { path: 'perfilPaciente', component: PacientePerfilComponent, data: { animation: 'PacientePerfilPage' } },
  { path: 'perfilEspecialista', component: EspecialistaPerfilComponent, data: { animation: 'EspecialistaPerfilPage' } },
  { path: 'perfilAdmin', component: AdminPerfilComponent, data: { animation: 'AdminPerfilPage' } },
  { path: 'pacientesAtendidos', component: PacientesAtendidosComponent, data: { animation: 'PacientesAtendidosPage' } },
  { path: 'estadisticas', component: EstadisticasComponent, data: { animation: 'PacientesAtendidosPage' } },
  { 
    path: 'turnos', 
    loadChildren: () => import('./components/turnos/pacientes/turnos-pacientes/turnos-pacientes.module').then(m => m.TurnosPacientesModule),
    data: { animation: 'TurnosPage' }
  },
  { path: 'seccionusuarios', component: SeccionusuariosComponent, data: { animation: 'SeccionUsuariosPage' } },
];
