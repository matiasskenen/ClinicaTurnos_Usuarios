import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleTurnoComponent } from './components/detalle-turno/detalle-turno.component';

const routes: Routes = [
  
  {
    path: "detalleturnoPaciente",
    component: DetalleTurnoComponent
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnosPacientesRoutingModule { }
