import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { TurnosService } from '../../../../../services/turnos/turnos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../../services/authUsers/data.service';
import { FiltrarTurnosPipe } from '../../../../filtrar-turnos.pipe';
import { Auth } from '@angular/fire/auth';
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
  
  constructor(private turnos: TurnosService, private userService: DataService, private router : Router, private auth : Auth) 
  {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user.email;
      }
    });
  }

  user : any;



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
        apellido: especialista.apellido,
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
  
    // Llamamos a la función validarturno y esperamos su respuesta
    this.validarturno(this.turnoSeleccionado, fechaFormateada).then((isValid: boolean) => {
      if (isValid) {
        // Si el turno es válido, se confirma la selección
        this.turnos.sendturno(this.user, this.especialista.nombre + " " + this.especialista.apellido, this.especialidadSeleccionada, this.turnoSeleccionado, this.especialista.email, fechaFormateada);
        this.mensajeExito = true;
        setTimeout(() => {
          this.mensajeExito = false;
  
          Swal.fire({
            title: 'Éxito!',
            text: 'El turno fue solicitado.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
  
          this.router.navigate(['/turnoPaciente']);
        }, 2000);
      } else {
        // Si el turno ya está reservado, mostramos el error
        Swal.fire({
          title: 'Error!',
          text: 'El turno ya está reservado.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    }).catch((error) => {
      console.log("Error al validar el turno", error);
      Swal.fire({
        title: 'Error!',
        text: 'Hubo un problema al validar el turno.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    });
  }

  async validarturno(horario: string, dia: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.turnos.getTurnos().subscribe((data: any[]) => {
        // Usamos un ciclo for para recorrer los turnos y detenernos cuando encontramos uno coincidente
        for (let turno of data) {
          if (turno.horario === horario && turno.dia === dia) {
            console.log("El turno ya está reservado.");
            resolve(false);  // Si encontramos un turno con el mismo horario y día, resolvemos como no válido
            return;  // Terminamos la función, evitando seguir iterando
          }
        }
  
        // Si no encontramos coincidencias, significa que el turno está disponible
        console.log("El turno está disponible.");
        resolve(true);
      }, (error) => {
        reject(error);  // Si ocurre un error en la consulta, lo rechazamos
      });
    });
  }
  
  sumarDias(fecha: Date, dias: number): Date {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    return nuevaFecha;
  }

  volverhome() {
    this.router.navigate(['/turnoPaciente']);
  }

  volver() {
    this.eleccion = false;
  }

  seleccionarEspecialidad(especialidad: any): void {
    this.especialidadSeleccionada = especialidad;
    this.eleccion2 = false;
  }

  
}
