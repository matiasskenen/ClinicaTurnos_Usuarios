import { Component } from '@angular/core';
import { TurnosService } from '../../../services/turnos/turnos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent {

  constructor(private turnos: TurnosService) {
    this.dataEspecialidades();
    this.dataNombres();
  }

  // Variables de búsqueda
  busqueda: string = '';
  especialidadesArray: string[] = [];
  nombresEspecialistasArray: any[] = [];
  especialidadesFiltradas: string[] = [];
  nombresFiltrados: any[] = [];

  // Función para filtrar tanto las especialidades como los nombres de especialistas
  filtrar() {
    this.filtrarEspecialidades();
    this.filtrarNombres();
  }

  filtrarEspecialidades() {
    const filtro = this.busqueda.toLowerCase();
    this.especialidadesFiltradas = this.especialidadesArray.filter((especialidad: string) =>
      String(especialidad).toLowerCase().includes(filtro)  // Convertimos a string antes de hacer toLowerCase()
    );
  }
  
  // Filtrar nombres de especialistas
  filtrarNombres() {
    const filtro = this.busqueda.toLowerCase();
    this.nombresFiltrados = this.nombresEspecialistasArray.filter((especialista: any) =>
      String(especialista.nombre).toLowerCase().includes(filtro) || 
      String(especialista.especialidad).toLowerCase().includes(filtro) // Convertimos a string antes de hacer toLowerCase()
    );
  }

  // Cargar especialistas y especialidades
  dataEspecialidades() {
    this.turnos.getEspecialistas().subscribe((data: any[]) => {
      this.especialidadesArray = data.map((especialista: any) => especialista.especialista);
      this.especialidadesFiltradas = [...this.especialidadesArray];
    });
  }

  dataNombres() {
    this.turnos.getEspecialistas().subscribe((data: any[]) => {
      this.nombresEspecialistasArray = data.map((especialista: any) => ({
        nombre: especialista.nombre,
        especialidad: especialista.especialista
      }));
      this.nombresFiltrados = [...this.nombresEspecialistasArray];
    });
  }
}
