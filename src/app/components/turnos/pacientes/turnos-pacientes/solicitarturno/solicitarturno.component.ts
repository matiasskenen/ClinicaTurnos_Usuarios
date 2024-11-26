import { Component } from '@angular/core';
import { TurnosService } from '../../../../../services/turnos/turnos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../../services/authUsers/data.service';
import { FiltrarTurnosPipe } from '../../../../filtrar-turnos.pipe';
@Component({
  selector: 'app-solicitarturno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitarturno.component.html',
  styleUrls: ['./solicitarturno.component.scss']
})
export class SolicitarturnoComponent {
  fechaSeleccionada: Date = new Date();
  nombresEspecialistasArray: any[] = [];
  nombresFiltrados: any[] = [];
  selectedEspecialidad: string = '';
  especialidadSeleccionada: string = '';
  especialidades: string[] = [];
  especialista: any = {};
  turnosDisponibles: string[] = [];
  turnoSeleccionado: string = '';
  mensajeExito: boolean = false;

  imagenesEspecilistasArray: any[] = [];
  usuarioActual: string = ''; // Variable para almacenar el usuario actual

  eleccion = false;
  eleccion2 = false;

  especialistasEmail = "";
  fechaMaxima: Date = new Date();
  
  constructor(private turnos: TurnosService, private userService: DataService, private router : Router) {}

  obtenerTurnosDisponibles() {
    if (this.especialidadSeleccionada && this.fechaSeleccionada) {
      this.turnosDisponibles = ['09:00 AM', '10:00 AM', '11:00 AM'];
    }
  }

  cambiarFecha(dias: number) {
    const nuevaFecha = new Date(this.fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    // Aseguramos que no se pueda pasar de los 15 días máximos
    if (nuevaFecha <= this.fechaMaxima && nuevaFecha >= new Date()) {
      this.fechaSeleccionada = nuevaFecha;
      this.generarTurnosDisponibles();
    }
  }

  ngOnInit(): void {
    this.usuarioActual = this.userService.getUser(); // Obtén el usuario actual
    this.dataNombres();
    this.calcularFechaMaxima(); 
  }

  calcularFechaMaxima() {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 15);  // Sumar 15 días a la fecha de hoy
    this.fechaMaxima = hoy;
  }

  // Obtener nombres de especialistas y especialidades
  dataNombres() {
    this.turnos.getEspecialistas().subscribe((data: any[]) => {
      this.nombresEspecialistasArray = data.map((especialista: any) => ({
        nombre: especialista.nombre,
        horario: especialista.horario,
        email : especialista.email,
        imagen : especialista.imagen,
        especialidades: Object.keys(especialista.especialista).filter(key => especialista.especialista[key])
      }));
      this.especialidades = [...new Set(this.nombresEspecialistasArray.flatMap(especialista => especialista.especialidades))];
    });
  }

  // Obtener imágenes filtradas por usuario
  dataImagenes() {
    this.turnos.getImagenesEspecialdiad().subscribe((data: any[]) => {
      // Filtrar las imágenes que correspondan al usuario actual
      this.imagenesEspecilistasArray = data.filter((especialista: any) => especialista.usuario === this.especialistasEmail).map((especialista: any) => ({
        usuario: especialista.usuario,
        especialidad1: especialista.especialidad1,
        especialidad2 : especialista.especialidad2,
        imgurl1 : especialista.imgurl1,
        imgurl2 : especialista.imgurl2,
      }));

      console.log(this.especialistasEmail)
    });
  }

  // Resto del código sigue igual
  seleccionarEspecialista(especialista: any) {
    this.eleccion = true;
    this.eleccion2 = true;
    this.especialista = especialista;
    this.especialistasEmail = especialista.email; // Ahora se asigna correctamente el email
    this.generarTurnosDisponibles();
    this.dataImagenes(); // Llamamos a la función para actualizar las imágenes
  }
  generarTurnosDisponibles() {
    const horario = this.especialista.horario.split('/');
    const horaInicio = parseInt(horario[0]);
    const horaFin = parseInt(horario[1]);
    const duracionTurno = 20;
    const turnos: string[] = [];
    let hora = horaInicio;
    let minuto = 0;

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

  seleccionarTurno(turno: string) {
    // Convierte el turno seleccionado a una fecha
    const [hora, minuto] = turno.split(':');
    const fechaSeleccionada = new Date();
    fechaSeleccionada.setHours(parseInt(hora));
    fechaSeleccionada.setMinutes(parseInt(minuto));
  
    // Verificar si la fecha seleccionada no excede la fecha máxima permitida
    if (fechaSeleccionada > this.fechaMaxima) {
      alert('No se puede seleccionar un turno más allá de 15 días de anticipación.');
      return;  // Salir si la fecha seleccionada no es válida
    }
  
    this.turnoSeleccionado = turno;
  }

  turnoValido : boolean = false;

  confirmarturno() {
    const dia = this.fechaSeleccionada;
    const fechaFormateada = `${dia.getDate().toString().padStart(2, '0')}/${(dia.getMonth() + 1).toString().padStart(2, '0')}/${dia.getFullYear()}`;
  
    this.turnoValido = false; // Inicializamos el valor de la validación
  
    // Llamamos a la función validarturno y esperamos la respuesta
    this.validarturno(this.turnoSeleccionado, fechaFormateada);
  
    // Usamos setTimeout para darle tiempo a la validación asincrónica
    setTimeout(() => {
      if (this.turnoValido) {
        // Si el turno es válido, se confirma la selección
        this.turnos.sendturno(this.userService.getUser(), this.especialista.nombre, this.especialidadSeleccionada, this.turnoSeleccionado, this.especialista.email, fechaFormateada);
        this.mensajeExito = true;
        setTimeout(() => {
          this.mensajeExito = false;
          this.router.navigate(['/turnoPaciente']);
        }, 2000);
      } else {
        console.log("Turno ya seleccionado");
      }
    }, 1000);  // Asegúrate de darle suficiente tiempo a la suscripción para que se ejecute
  }

  validarturno(horario: string, dia: string): void {
    this.turnos.getTurnos().subscribe((data: any[]) => {
      // Filtrar los turnos que coincidan con el horario y el día proporcionado
      const turnoExistente = data.find((turno: any) => turno.horario === horario && turno.dia === dia);
  
      // Si ya existe un turno con el mismo horario y día, marcamos como no válido
      if (turnoExistente) {
        console.log("El turno ya está reservado.");
        this.turnoValido = false;
      } else {
        console.log("El turno está disponible.");
        this.turnoValido = true;
      }
    });
  }
  

  volverhome() {
    this.router.navigate(['/turnoPaciente']);
  }

  volver() {
    this.eleccion = false;
  }

  seleccionarEspecialidad(especialidad: any): void {
    this.especialidadSeleccionada = especialidad;
  }

  
}
