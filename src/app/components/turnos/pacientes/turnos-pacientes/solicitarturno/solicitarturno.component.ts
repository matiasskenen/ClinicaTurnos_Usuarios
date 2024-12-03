import { Component, input } from '@angular/core';
import Swal from 'sweetalert2';
import { TurnosService } from '../../../../../services/turnos/turnos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../../services/authUsers/data.service';
import { FiltrarTurnosPipe } from '../../../../filtrar-turnos.pipe';
import { Auth } from '@angular/fire/auth';
import { CaptchaDirective } from '../../../../directivas/captcha/captcha.directive';
import { CaptchaService } from '../../../../services/captcha.service';
import { Input } from '@angular/core';
import { ScrollDirective } from '../../../../directivas/scroll/scroll.directive';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-solicitarturno',
  standalone: true,
  imports: [CommonModule, FormsModule, CaptchaDirective, ScrollDirective],
  templateUrl: './solicitarturno.component.html',
  styleUrls: ['./solicitarturno.component.scss']
})
export class SolicitarturnoComponent {

  
  captchaValid: boolean = false;
  disableCaptcha: boolean = false; // Controla si el captcha está habilitado
  private captchaSubscription: Subscription;

  fechaSeleccionada: Date = new Date();
  nombresEspecialistasArray: any[] = [];
  nombresFiltrados: any[] = [];
  nombresEspecialistasArrayPacientes: any[] = [];
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
  
  constructor(private turnos: TurnosService, private userService: DataService, private router : Router, private auth : Auth, private captchaService: CaptchaService) 
  {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user.email;
      }
    });

    this.captchaSubscription = this.captchaService.captchaEnabled$.subscribe(enabled => {
      this.disableCaptcha = !enabled;  // Si está habilitado, disableCaptcha será false
    });
  }

  user : any;


  captchaEnabled!: boolean;

  captchaCode: string = '';
  userInput: string = '';
  captchaVerified: boolean | null = null;

   // Generar CAPTCHA
   generateCaptcha(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaCode = Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    this.userInput = '';  // Restablece el campo de entrada del usuario
    this.captchaVerified = null;  // Restablece la verificación
  }

  // Verificar CAPTCHA
  verifyCaptcha(): void {
    this.captchaVerified = this.userInput === this.captchaCode;
  
    if (this.captchaVerified) {
      this.captchaValid = true;
      this.habilitado = true;  // Habilita el botón para solicitar el turno
    } else {
      this.captchaValid = false;
    }
  }

  handleCaptchaValidation(isValid: boolean) {
    this.captchaValid = isValid; // Actualiza la validez del CAPTCHA
  }

  irArriba() {
    window.scrollTo({
      top: 0, // Ir al inicio de la página
      behavior: 'smooth' // Desplazamiento suave
    });
  }

  habilitado = false;

  onCaptchaValidation(isValid: any): void {
    if (isValid) {
      this.habilitado = true;
      console.log('CAPTCHA válido, puedes continuar');
    } else {
      console.log('CAPTCHA inválido, por favor intenta de nuevo');
    }
  }


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

  captchaVisible = false;

  ngOnInit(): void {
    this.usuarioActual = this.userService.getUser(); // Obtén el usuario actual
    this.dataNombres();
    this.calcularFechaMaxima(); 
    this.captchaService.captchaEnabled$.subscribe(
      (enabled) => {
        this.captchaEnabled = enabled;
        console.log('Captcha habilitado:', this.captchaEnabled);
        this.captchaVisible = true;
      }
    );
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

  nombrePaciente: string = "";

  dataNombresPaciente(usuarioEmail: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.turnos.getUsers().subscribe((data: any[]) => {
        const pacienteFiltrado = data.find((paciente: any) => paciente.email === usuarioEmail);
  
        if (pacienteFiltrado) {
          this.nombrePaciente = `${pacienteFiltrado.nombre} ${pacienteFiltrado.apellido}`;
          resolve(); // Resuelve la promesa cuando el nombre del paciente se obtiene correctamente
        } else {
          console.warn('No se encontró un paciente con el email especificado.');
          this.nombrePaciente = "Paciente no encontrado";
          reject(new Error('Paciente no encontrado'));
        }
      }, (error) => {
        console.error('Error al obtener los datos del paciente', error);
        reject(error); // Rechaza la promesa si ocurre un error
      });
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
    this.irArriba();
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

  async confirmarturno() {
    const dia = this.fechaSeleccionada;
    const fechaFormateada = `${dia.getDate().toString().padStart(2, '0')}/${(dia.getMonth() + 1).toString().padStart(2, '0')}/${dia.getFullYear()}`;
  
    try {
      const isValid = await this.validarturno(this.turnoSeleccionado, fechaFormateada);
      if (isValid) {
        await this.dataNombresPaciente(this.user); // Espera a que se obtenga el nombre del paciente
  
        this.turnos.sendturno(
          this.user,
          `${this.especialista.nombre} ${this.especialista.apellido}`,
          this.especialidadSeleccionada,
          this.turnoSeleccionado,
          this.especialista.email,
          fechaFormateada,
          this.nombrePaciente
        );
  
        this.mensajeExito = true;
        setTimeout(() => {
          this.mensajeExito = false;
          Swal.fire({
            title: 'Éxito!',
            text: 'El turno fue solicitado.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
  
          this.turnos.sendlogTurnoMedico(`${this.especialista.nombre} ${this.especialista.apellido}`);
          this.turnos.sendLogTurnosPorDia();
          this.turnos.sendLogEspecialidad(this.especialidadSeleccionada);
          this.router.navigate(['/turnoPaciente']);
        }, 2000);
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'El turno ya está reservado.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
        });
      }
    } catch (error) {
      console.log('Error al confirmar el turno:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Hubo un problema al confirmar el turno.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      });
    }
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
