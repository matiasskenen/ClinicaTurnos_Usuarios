import { Component } from '@angular/core';
import { TurnosService } from '../../../services/turnos/turnos.service';
import { DataService } from '../../../services/authUsers/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-especialistas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialistas.component.html',
  styleUrl: './especialistas.component.scss',
})
export class EspecialistasComponent {
  // Variables
  nombresEspecialistasArray: any[] = [];
  nombresFiltrados: any[] = []; // Inicialización como array vacío
  especialidadSeleccionada: string = '';
  especialista: any = {};
  turnosDisponibles: string[] = [];
  turnoSeleccionado: string = '';
  mensajeExito: boolean = false; // Para mostrar el mensaje de éxito
  pacienteFiltrado = "";

  constructor(
    private turnos: TurnosService,
    private userService: DataService,
    private auth: Auth,
  ) {
    this.dataNombres();
  }

  // Función para obtener los turnos del usuario
  dataNombres() {
    this.auth.onAuthStateChanged((user) => {
      let usuarioActual = user?.email ;

      // Llamada al servicio para obtener los turnos
      this.turnos.getTurnos().subscribe({
        next: (data: any[]) => {
          // Filtrar los turnos donde el paciente es el usuario actual
          this.nombresEspecialistasArray = data
            .filter((turno: any) => turno.emailEspecialsita === usuarioActual) // Filtra por el paciente
            .map((turno: any) => ({
              paciente: turno.paciente,
              especialista: turno.especialista,
              especialidad: turno.especialidad,
              horario: turno.horario,
              estado: turno.estado,
              mensaje : turno.mensaje
            }));

          // Actualizar los turnos filtrados para la visualización
          this.nombresFiltrados = [...this.nombresEspecialistasArray];

          console.log(this.nombresEspecialistasArray); // Verificar los turnos filtrados
        },
        error: (err) => {
          console.error('Error al obtener los turnos:', err);
        },
      });
    });
  }

  cambiarEstado(estado : string, usuario : any)
  {
    console.log(usuario.paciente)
    this.turnos.ingresarEstado(estado, usuario.paciente)
  }

  cambiarMensaje(mensaje : string, usuario : any)
  {
    this.turnos.ingresarMensaje(mensaje, usuario.paciente)
  }
}
