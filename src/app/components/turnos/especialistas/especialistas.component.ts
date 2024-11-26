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
              mensaje: turno.mensaje
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

  cambiarEstado(estado: string, usuario: any) {
    console.log(usuario.paciente)
    console.log(usuario.horario)
    this.turnos.ingresarEstado(estado, usuario.paciente, usuario.horario)
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
    console.log('Diagnóstico Guardado:', turno.diagnostico);
    console.log('Comentarios Guardados:', turno.comentarios);

    this.turnos.ingresarDiagnostico(turno.diagnostico, usuario)
    this.turnos.ingresarComentario(turno.comentarios, usuario)


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
  }

  guardarHistoriaClinica(turno: any, usuario: any) {
    console.log('Altura:', turno.altura);
    console.log('Peso:', turno.peso);
    console.log('Temperatura:', turno.temperatura);
    console.log('Presión Arterial:', turno.presion);

    console.log('Temperatura:', turno.NombredatodinamicoUno);
    console.log('Presión Arterial:', turno.datodinamicoUno);

    console.log('Temperatura:', turno.NombredatodinamicoDos);
    console.log('Presión Arterial:', turno.datodinamicoDos);

    this.turnos.sendHistoriaClinica(this.doctorActual, turno.paciente, turno.altura, turno.peso, turno.temperatura, turno.presion, turno.temperatura, turno.NombredatodinamicoUno, turno.NombredatodinamicoDos, turno.datodinamicoDos)
    this.cambiarEstado('historiaClinica', turno); // 
    turno.mostrarFormularioHistoriaClinica = false;
    // Llamar al servicio para guardar la historia clínica en el backend

  }

  datodinamico1 = false;
  datodinamico2 = false;

  Agregardatodinamico1() {
    this.datodinamico1 = true;
  }

  Agregardatodinamico2() {
    this.datodinamico2 = true;
  }

  verdiagnostico(usuario : string)
  {
    
  }

  verDiagnosticoTerminado(turno: any) {
    // Mostrar el formulario solo para el turno seleccionado
    this.nombresEspecialistasArray.forEach((t) => {
      t.verDiagnosticoTerminado = false;
    });
  
    // Obtener los turnos
    this.turnos.getTurnos().subscribe({
      next: (data: any[]) => {
        // Filtrar los turnos donde el paciente es el usuario actual
        this.diagnosticoArray = data
          .filter((t: any) => t.paciente) // Filtra turnos válidos
          .map((t: any) => ({
            paciente: t.paciente,
            comentario: t.comentario,
            diagnostico: t.diagnostico,
          }));
  
        // Buscar el turno específico en la respuesta y asignar el diagnóstico
        const turnoEncontrado = data.find((t: any) => t.id === turno.id);
  
        if (turnoEncontrado) {
          turno.diagnostico = turnoEncontrado.diagnostico || "Sin diagnóstico";
          turno.comentarios = turnoEncontrado.comentario || "Sin diagnóstico";
        } else {
          turno.diagnostico = "No se encontró información";
        }
      },
      error: (err) => {
        console.error("Error al obtener los turnos:", err);
        turno.diagnostico = "Error al obtener diagnóstico";
      },
    });
  
    // Mostrar diagnóstico solo para el turno seleccionado
    turno.verDiagnosticoTerminado = true;
  }
  

  ocultarDiagnosticoTerminado(turno: any) {
    turno.verDiagnosticoTerminado = false;
  }


}
