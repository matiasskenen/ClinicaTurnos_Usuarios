import { Component } from '@angular/core';
import { TurnosService } from '../../../../../services/turnos/turnos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../../services/authUsers/data.service';

@Component({
  selector: 'app-solicitarturno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitarturno.component.html',
  styleUrls: ['./solicitarturno.component.scss']
})
export class SolicitarturnoComponent {

  // Variables
  nombresEspecialistasArray: any[] = [];
  nombresFiltrados: any[] = []; // Inicialización como array vacío
  selectedEspecialidad: string = '';
  especialidadSeleccionada: string = '';
  especialidades: string[] = [];
  especialista: any = {};
  turnosDisponibles: string[] = [];
  turnoSeleccionado: string = '';
  mensajeExito: boolean = false;  // Para mostrar el mensaje de éxito

  constructor(private turnos: TurnosService, private userService: DataService, private router : Router) {}

  ngOnInit(): void {
    this.dataNombres();
  }

  // Obtener nombres de especialistas y especialidades
  dataNombres() {
    this.turnos.getEspecialistas().subscribe((data: any[]) => {
      this.nombresEspecialistasArray = data.map((especialista: any) => ({
        nombre: especialista.nombre,
        horario: especialista.horario,
        email : especialista.email,
        especialidades: Object.keys(especialista.especialista).filter(key => especialista.especialista[key])
      }));

      // Obtención de especialidades únicas
      this.especialidades = [...new Set(this.nombresEspecialistasArray.flatMap(especialista => especialista.especialidades))];
    });
  }

  // Mostrar especialistas por especialidad seleccionada
  mostrarEspecialistasPorEspecialidad(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.especialidadSeleccionada = selectElement?.value || '';
    this.nombresFiltrados = this.nombresEspecialistasArray.filter((especialista: any) =>
      especialista.especialidades.includes(this.especialidadSeleccionada)
    );
  }

  // Seleccionar un especialista
  seleccionarEspecialista(especialista: any) {
    this.especialista = especialista; // Asignamos el especialista seleccionado
    this.generarTurnosDisponibles(); // Generar los turnos disponibles
  }

  // Generar los turnos disponibles según el horario del especialista
  generarTurnosDisponibles() {
    const horario = this.especialista.horario.split('/'); // "9/17"
    const horaInicio = parseInt(horario[0]);
    const horaFin = parseInt(horario[1]);
    const duracionTurno = 20; // Duración del turno en minutos

    const turnos: string[] = [];
    let hora = horaInicio;
    let minuto = 0;

    // Generar los turnos
    while (hora < horaFin || (hora === horaFin && minuto === 0)) {
      const horaStr = hora < 10 ? `0${hora}` : `${hora}`;
      const minutoStr = minuto < 10 ? `0${minuto}` : `${minuto}`;
      turnos.push(`${horaStr}:${minutoStr}`);

      minuto += duracionTurno;
      if (minuto >= 60) {
        minuto = 0;
        hora++;
      }
    }

    this.turnosDisponibles = turnos;
  }

  // Seleccionar un turno
  seleccionarTurno(turno: string) {
    this.turnoSeleccionado = turno;

    // Guardar turno
    this.turnos.sendturno(this.userService.getUser(), this.especialista.nombre, this.especialidadSeleccionada, this.turnoSeleccionado, this.especialista.email);

    // Mostrar mensaje de éxito durante 2 segundos
    this.mensajeExito = true;
    setTimeout(() => {
      this.mensajeExito = false;
      this.router.navigate(['/turnoPaciente']); // Redirigir después de 2 segundos
    }, 2000);
  }
}
