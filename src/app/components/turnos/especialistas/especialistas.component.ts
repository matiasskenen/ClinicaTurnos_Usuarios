import { Component } from '@angular/core';
import { TurnosService } from '../../../services/turnos/turnos.service';
import { DataService } from '../../../services/authUsers/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { FilterPipe } from '../../pipes/filtroDatos/filter.pipe';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-especialistas',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe],
  templateUrl: './especialistas.component.html',
  styleUrl: './especialistas.component.scss',
})
export class EspecialistasComponent {
  // Variables
  searchText: string = '';
  diagnosticoArray: any[] = [];
  nombresEspecialistasArray: any[] = [];
  nombresFiltrados: any[] = []; // Inicialización como array vacío
  especialidadSeleccionada: string = '';
  especialista: any = {};
  turnosDisponibles: string[] = [];
  turnoSeleccionado: string = '';
  mensajeExito: boolean = false; // Para mostrar el mensaje de éxito
  pacienteFiltrado = "";
  doctorActual: any;

  emailPaciente = "";

  constructor(
    private turnos: TurnosService,
    private userService: DataService,
    private auth: Auth,
  ) {
    this.dataFiltros();
  }

  // Función para obtener los turnos del usuario
  dataNombres() {
    this.auth.onAuthStateChanged((user) => {
      let usuarioActual = user?.email;
      this.doctorActual = user?.email;

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
              mensaje: turno.mensaje,

            }));

          // Actualizar los turnos filtrados para la visualización
          this.nombresFiltrados = [...this.nombresEspecialistasArray];
        },
        error: (err) => {
          console.error('Error al obtener los turnos:', err);
        },
      });
    });
  }

  historiaclinicaaray: any[] = [];
  historiaEncontrada = false;

  datahistoria() {
    this.auth.onAuthStateChanged((user) => {
      const usuarioActual = user?.email;

      if (!usuarioActual) {
        console.error('No se encontró un usuario autenticado.');
        return;
      }

      this.doctorActual = usuarioActual;
      console.log("entre");

      // Llamar solo al servicio de historia clínica
      this.turnos.getHistoriaClinica().subscribe({
        next: (historiaClinica) => {
          console.log('Datos recibidos:', historiaClinica);

          // Filtrar y mapear las historias clínicas
          const historiaFiltrada = historiaClinica
            .filter((historia: any) => historia.emailEspecialsita === usuarioActual)
            .map((historia: any) => ({
              altura: historia.altura || '',
              peso: historia.peso || '',
              presion: historia.presion || '',
              temperatura: historia.temperatura || '',
            }));

          console.log("Historias clínicas filtradas:", historiaFiltrada);
          this.historiaclinicaaray = historiaFiltrada;
        },
        error: (err) => {
          console.error('Error al obtener los datos de historia clínica:', err);
        },
      });
    });
  }

  dataFiltros() {
    this.auth.onAuthStateChanged((user) => {
      const usuarioActual = user?.email;
  
      if (!usuarioActual) {
        console.error('No se encontró un usuario autenticado.');
        return;
      }
  
      this.doctorActual = usuarioActual;
      console.log("entre");
  
      // Llamar solo al servicio de historia clínica
      this.turnos.getHistoriaClinica().subscribe({
        next: (historiaClinica) => {
          console.log('Datos recibidos:', historiaClinica);
  
          // Filtrar las historias clínicas por emaildoctor
          const historiaFiltrada = historiaClinica
            .filter((historia: any) => historia.emailEspecialsita === usuarioActual)
            .map((historia: any) => ({
              altura: historia.altura,
              peso: historia.peso,
              presion: historia.presion,
              temperatura: historia.temperatura,
              usuario: historia.paciente,
              emaildoctor: historia.emailEspecialsita
            }));
  
          console.log("Historias clínicas filtradas:", historiaFiltrada);
          this.nombresEspecialistasArray = historiaFiltrada;
  
          // Llamar al servicio de turnos después de obtener la historia clínica
          this.turnos.getTurnos().subscribe({
            next: (turno) => {
              console.log('Datos recibidos:', turno);
  
              // Filtrar los turnos por emaildoctor
              const turnosFiltrados = turno
                .filter((turno: any) => turno.emailEspecialsita === usuarioActual)
                .map((turno: any) => ({
                  paciente: turno.paciente,
                  especialista: turno.especialista,
                  especialidad: turno.especialidad,
                  horario: turno.horario,
                  estado: turno.estado,
                  mensaje: turno.mensaje,
                  emaildoctor: turno.emailEspecialsita,
                  comentario: turno.comentario,
                  dia: turno.dia,
                  comentarioPaciente : turno.comentarioPaciente,
                }));
  
              console.log("turnosFiltrados:", turnosFiltrados);
  
              // Unir ambos arrays (historias clínicas y turnos filtrados)
              // Unir ambos arrays
              const datosCombinados = historiaFiltrada.concat(turno);
              console.log("Datos combinados:", datosCombinados);
              this.nombresEspecialistasArray = datosCombinados;
            },
            error: (err) => {
              console.error('Error al obtener los datos de turnos:', err);
            },
          });
        },
        error: (err) => {
          console.error('Error al obtener los datos de historia clínica:', err);
        },
      });
    });
  }
  

  cambiarEstado(estado: string, usuario: any) {
    console.log(usuario.paciente)
    console.log(usuario.horario)
    this.turnos.ingresarEstado(estado, usuario.paciente, usuario.horario)

    if(estado == "finalizar")
    {
      this.turnos.sendLogTurnoFinalizado(usuario.especialista)
    }
  }

  cambiarMensaje(mensaje: string, usuario: any) {
    this.turnos.ingresarMensaje(mensaje, usuario.paciente)
  }

  mostrarFormularioDiagnostico(turno: any) {
    // Mostrar el formulario solo para el turno seleccionado
    this.nombresEspecialistasArray.forEach((t) => {
      t.mostrarFormularioDiagnostico = false;
    });
    turno.mostrarFormularioDiagnostico = true;
  }

  ocultarFormularioDiagnostico(turno: any) {
    turno.mostrarFormularioDiagnostico = false;
  }

  guardarDiagnostico(turno: any, usuario: any) {
    this.turnos.ingresarDiagnostico(turno.diagnostico, usuario, turno.horario)
    this.turnos.ingresarComentario(turno.comentario, usuario, turno.horario)

    // Aquí puedes realizar el llamado al servicio para guardar los datos en el backend
    this.cambiarEstado('diagnosticado', turno); // Cambiar estado del turno
    turno.mostrarFormularioDiagnostico = false;
  }

  mostrarFormularioHistoriaClinica(turno: any) {
    // Mostrar el formulario solo para el turno seleccionado
    this.nombresEspecialistasArray.forEach((t) => {
      t.mostrarFormularioHistoriaClinica = false;
    });
    turno.mostrarFormularioHistoriaClinica = true;
  }

  ocultarHistoriaClinica(turno: any) {
    turno.mostrarFormularioHistoriaClinica = false;
    this.datodinamico1 = false;
    this.datodinamico2 = false;
    this.datodinamico3 = false;
  }


  guardarHistoriaClinica(turno: any, usuario: any) {
    this.turnos.ingresarHistoriaClinica(turno.altura, turno.peso, turno.temperatura, turno.presion, this.nombreDinamicoUno, this.NombreDinamicoDos, this.datoDinamicoUno, this.datoDinamicoDos, usuario, turno.horario)
    this.cambiarEstado('historiaClinica', turno); // 
    turno.mostrarFormularioHistoriaClinica = false;
    // Llamar al servicio para guardar la historia clínica en el backend
  }

  datodinamico1: boolean = false;
  datodinamico2: boolean = false;
  datodinamico3: boolean = false;

  nombreDinamicoUno: string = '';
  datoDinamicoUno: string = '';
  
  NombreDinamicoDos: string = '';
  datoDinamicoDos: string = '';
  
  NombreDinamicoTres: string = '';
  datoDinamicoTres: string = '';

  // Funciones para agregar datos dinámicos
  Agregardatodinamico1() {
    this.datodinamico1 = true;
  }

  Agregardatodinamico2() {
    this.datodinamico2 = true;
  }

  Agregardatodinamico3() {
    this.datodinamico3 = true;
  }



  verdiagnostico(usuario: string) {}

  verDiagnosticoTerminado(turno: any) {
    // Mostrar el formulario solo para el turno seleccionado
    this.nombresEspecialistasArray.forEach((t) => {
      t.mostrarFormularioDiagnostico = false;
    });
    turno.mostrarFormularioDiagnostico = true;
  }

  ocultarverComentarioPaciente(turno: any) {
    turno.verComentarioPaciente = false;
  }

  verComentarioPaciente(turno: any) {
    // Mostrar el formulario solo para el turno seleccionado
    this.nombresEspecialistasArray.forEach((t) => {
      t.verComentarioPaciente = false;
    });
    turno.verComentarioPaciente = true;
  }

  // Código de envío
  toggleMensajeExito() {
    this.mensajeExito = !this.mensajeExito;
  }

}
