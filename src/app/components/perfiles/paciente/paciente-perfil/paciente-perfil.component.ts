import { Component } from '@angular/core';
import { TurnosService } from '../../../../services/turnos/turnos.service';
import { DataService } from '../../../../services/authUsers/data.service';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Make sure this import is added

@Component({
  selector: 'app-paciente-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente-perfil.component.html',
  styleUrl: './paciente-perfil.component.scss',
})
export class PacientePerfilComponent {
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
  pacienteActual: any;
  historiaClinicaSeleccionada: any = null;

  constructor(
    private turnos: TurnosService,
    private userService: DataService,
    private auth: Auth,
  ) {
    this.init();
  }

  // Función para obtener los turnos del usuario y luego las historias clínicas
  async init() {
    await this.dataNombres(); // Espera a que dataNombres termine
    this.mostrarHistoriaClinica(); // Después, llama a mostrarHistoriaClinica
  }

  // Función para obtener los turnos del usuario
  async dataNombres() {
    return new Promise<void>((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        this.pacienteActual = user?.email;

        // Llamada al servicio para obtener los turnos
        this.turnos.getPacientes().subscribe({
          next: (data: any[]) => {
            // Filtrar los turnos donde el paciente es el usuario actual
            this.nombresEspecialistasArray = data // Filtra por el paciente
              .map((turno: any) => ({
                nombre: turno.nombre,
                dni: turno.dni,
                apellido: turno.apellido,
                imagen: turno.imagen,
                edad: turno.edad,
                email: turno.email,
                doctoremail: turno.emailEspecialsita
              }));

            // Actualizar los turnos filtrados para la visualización
            this.nombresFiltrados = [...this.nombresEspecialistasArray];
            resolve(); // Resuelve cuando los datos de turnos estén disponibles
          },
          error: (err) => {
            console.error('Error al obtener los turnos:', err);
            reject(err); // Rechaza en caso de error
          },
        });
      });
    });
  }

  // Función para mostrar la historia clínica del paciente
  mostrarHistoriaClinica() {
    console.log("user " + this.pacienteActual);

    this.turnos.getHistoriaClinica().subscribe({
      next: (data: any[]) => {
        // Filtrar todas las historias clínicas del paciente
        const historiasFiltradas = data.filter(
          (historia: any) => historia.paciente === this.pacienteActual
        );

        // Si se encuentran historias clínicas, procesarlas
        if (historiasFiltradas.length > 0) {
          this.historiaClinicaSeleccionada = historiasFiltradas.map((historia: any) => {
            const datosDinamicos = Object.entries(historia)
              .filter(
                ([key]) =>
                  ![
                    'altura',
                    'peso',
                    'presion',
                    'temperatura',
                    'fecha',
                    'doctor',
                    'paciente',
                    'observaciones',
                  ].includes(key)
              )
              .map(([titulo, valor]) => ({ titulo, valor })); // Extraer los datos dinámicos

            return {
              altura: historia.altura,
              peso: historia.peso,
              presion: historia.presion,
              temperatura: historia.temperatura,
              fecha: historia.fecha,
              doctor: historia.doctor,
              observaciones: historia.observaciones || 'Sin observaciones',
              datosDinamicos, // Datos dinámicos
            };
          });
        } else {
          console.log('No se encontraron historias clínicas para este paciente.');
          this.historiaClinicaSeleccionada = []; // Limpiar si no hay resultados
        }

        console.log(this.historiaClinicaSeleccionada); // Verificar el resultado
      },
      error: (err) => {
        console.error('Error al obtener las historias clínicas:', err);
      },
    });
  }

  // Método para descargar la historia clínica en PDF
  descargarHistoriaClinica() {
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text('Historias Clínicas de ' + this.pacienteActual, 20, 20);

    // Definir encabezado de la tabla
    const columns = ['Fecha', 'Doctor', 'Peso', 'Altura', 'Presión', 'Temperatura', 'Observaciones'];
    const row: any[] = [];

    // Llenar las filas de la tabla con las historias clínicas
    this.historiaClinicaSeleccionada.forEach((historia: any) => {
      row.push([
        historia.fecha,
        historia.doctor,
        historia.peso,
        historia.altura,
        historia.presion,
        historia.temperatura,
        historia.observaciones || 'Sin observaciones'
      ]);
    });

    // Usar autoTable para agregar la tabla al PDF
    doc.auto({
      head: [columns],
      body:  row
    });

    // Guardar el archivo PDF con el nombre correspondiente
    doc.save('historias_clinicas_' + this.pacienteActual + '.pdf');
  }
}
