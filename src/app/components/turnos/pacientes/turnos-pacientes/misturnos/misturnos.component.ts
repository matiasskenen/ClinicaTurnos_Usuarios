import { Component } from '@angular/core';
import { TurnosService } from '../../../../../services/turnos/turnos.service';
import { DataService } from '../../../../../services/authUsers/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-misturnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './misturnos.component.html',
  styleUrl: './misturnos.component.scss'
})
export class MisturnosComponent {

  // Variables
  nombresEspecialistasArray: any[] = [];
  nombresFiltrados: any[] = []; // Inicialización como array vacío
  especialidadSeleccionada: string = '';
  especialista: any = {};
  turnosDisponibles: string[] = [];
  turnoSeleccionado: string = '';
  mensajeExito: boolean = false;  // Para mostrar el mensaje de éxito

  constructor(private turnos: TurnosService, private userService: DataService) {
    this.dataNombres();
  }

  // Función para obtener los turnos del usuario
  dataNombres() {
    // Obtener el usuario actual
    const usuarioActual = this.userService.getUser();

    // Verificar si el usuario está disponible
    if (!usuarioActual) {
      console.error("Usuario no disponible.");
      return; // Si no hay usuario, salimos de la función
    }

    // Llamada al servicio para obtener los turnos
    this.turnos.getTurnos().subscribe({
      next: (data: any[]) => {
        // Filtrar los turnos donde el paciente es el usuario actual
        this.nombresEspecialistasArray = data
          .filter((turno: any) => turno.paciente === usuarioActual)  // Filtra por el paciente
          .map((turno: any) => ({
            paciente: turno.paciente,
            especialista: turno.especialista,
            especialidad: turno.especialidad,
            horario: turno.horario
          }));

        // Actualizar los turnos filtrados para la visualización
        this.nombresFiltrados = [...this.nombresEspecialistasArray];

        console.log(this.nombresEspecialistasArray); // Verificar los turnos filtrados
      },
      error: (err) => {
        console.error("Error al obtener los turnos:", err);
      }
    });
  }

  // Filtro para buscar por especialidad o especialista
  aplicarFiltro() {
    this.nombresFiltrados = this.nombresEspecialistasArray.filter(turno =>
      (this.especialidadSeleccionada ? turno.especialidad.toLowerCase().includes(this.especialidadSeleccionada.toLowerCase()) : true) &&
      (this.especialista ? turno.especialista.toLowerCase().includes(this.especialista.toLowerCase()) : true)
    );
  }
}
