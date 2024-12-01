import { Component } from '@angular/core';
import { TurnosService } from '../../services/turnos/turnos.service';
import { DataService } from '../../services/authUsers/data.service';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pacientes-atendidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes-atendidos.component.html',
  styleUrl: './pacientes-atendidos.component.scss'
})
export class PacientesAtendidosComponent {

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
       this.doctorActual = user?.email;
 
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
               doctoremail : turno.emailEspecialsita
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

   historiaClinicaSeleccionada: any = null; 



   mostrarHistoriaClinica(turno: any) {
    console.log(turno);
  
    this.turnos.getTurno().subscribe({
      next: (data: any[]) => {
        // Filtrar todas las historias clínicas del paciente
        const historiasFiltradas = data.filter(
          (historia: any) => historia.paciente === turno
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
                    'especialista',
                    'diagnostico',
                    'horario',
                    'comentario',
                    'emailEspecialsita',
                    'especialidad',
                    'dia',
                    'estado',
                    'mensaje',
                    'comentarioPaciente'

                  ].includes(key)
              )
              .map(([titulo, valor]) => ({ titulo, valor })); // Extraer los datos dinámicos
  
            return {
              dia: historia.dia,
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
  
  
  ocultarHistoriaClinica(turno: any) {
    turno.historiaClinicaSeleccionada = false;
  }

}
