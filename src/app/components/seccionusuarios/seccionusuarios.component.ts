import { Component } from '@angular/core';
import { TurnosService } from '../../services/turnos/turnos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios/usuarios.service';

@Component({
  selector: 'app-seccionusuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seccionusuarios.component.html',
  styleUrl: './seccionusuarios.component.scss'
})
export class SeccionusuariosComponent {

  constructor(private turnos: TurnosService, private usuarios : UsuariosService)
  {
    this.dataNombres();
  }

  busqueda: string = '';
  especialidadesArray: string[] = [];
  nombresEspecialistasArray: any[] = [];
  especialidadesFiltradas: string[] = [];
  nombresFiltrados: any[] = [];

  
  // Filtrar nombres de especialistas
  filtrarNombres() {
    const filtro = this.busqueda.toLowerCase();
    this.nombresFiltrados = this.nombresEspecialistasArray.filter((especialista: any) =>
      String(especialista.nombre).toLowerCase().includes(filtro) || 
      String(especialista.especialidad).toLowerCase().includes(filtro) // Convertimos a string antes de hacer toLowerCase()
    );
  }


  dataNombres() {
    this.turnos.getEspecialistas().subscribe((data: any[]) => {
      this.nombresEspecialistasArray = data.map((especialista: any) => ({
        nombre: especialista.nombre,
        verificado : especialista.verificado,
        email : especialista.email
      }));
      this.nombresFiltrados = [...this.nombresEspecialistasArray];

      console.log(this.nombresFiltrados)
    });
  }

  modificarVerificado(funcion : string, nombre : string)
  { 
    this.usuarios.modificarVerficiado(funcion, nombre)
  }



}
