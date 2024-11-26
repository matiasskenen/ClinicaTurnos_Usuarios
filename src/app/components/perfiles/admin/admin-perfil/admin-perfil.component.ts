import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TurnosService } from '../../../../services/turnos/turnos.service';
import { DataService } from '../../../../services/authUsers/data.service';
import { Auth } from '@angular/fire/auth';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-admin-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-perfil.component.html',
  styleUrl: './admin-perfil.component.scss'
})
export class AdminPerfilComponent {
  diagnosticoArray: any[] = [];
  nombresEspecialistasArray: any[] = [];
  nombresFiltrados: any[] = [];
  especialidadSeleccionada: string = '';
  especialista: any = {};
  turnosDisponibles: string[] = [];
  turnoSeleccionado: string = '';
  mensajeExito: boolean = false;
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

  async init() {
    await this.dataNombres();
    this.mostrarHistoriaClinica();
  }

  async dataNombres() {
    return new Promise<void>((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        this.pacienteActual = user?.email;
        this.turnos.getadmin().subscribe({
          next: (data: any[]) => {
            this.nombresEspecialistasArray = data
              .map((turno: any) => ({
                nombre: turno.nombre,
                dni: turno.dni,
                apellido: turno.apellido,
                imagen: turno.imagen,
                edad: turno.edad,
                email: turno.email,
                doctoremail: turno.emailEspecialsita
              }));
            this.nombresFiltrados = [...this.nombresEspecialistasArray];
            resolve();
          },
          error: (err) => {
            console.error('Error al obtener los turnos:', err);
            reject(err);
          },
        });
      });
    });
  }

  mostrarHistoriaClinica() {
    console.log("user " + this.pacienteActual);
    this.turnos.getUsers().subscribe({
      next: (data: any[]) => {
        const historiasFiltradas = data.filter(
          (historia: any) => historia.paciente === this.pacienteActual
        );
        if (historiasFiltradas.length > 0) {
          this.historiaClinicaSeleccionada = historiasFiltradas.map((historia: any) => {
            const datosDinamicos = Object.entries(historia)
              .filter(
                ([key]) =>
                  ![
                    'apellido',
                    'clave',
                    'dni',
                    'edad',
                    'email',
                    'nombre',
                    'obrasocial',
                  ].includes(key)
              )
              .map(([titulo, valor]) => ({ titulo, valor }));
            return {
              apellido: historia.apellido,
              clave: historia.clave,
              dni: historia.dni,
              edad: historia.edad,
              email: historia.email,
              nombre: historia.nombre,
              obrasocial: historia.obrasocial,
            };
          });
        } else {
          console.log('No se encontraron historias clínicas para este paciente.');
          this.historiaClinicaSeleccionada = [];
        }
        console.log(this.historiaClinicaSeleccionada);
      },
      error: (err) => {
        console.error('Error al obtener las historias clínicas:', err);
      },
    });
  }

  ddescargarHistoriaClinica() {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.text('Historias Clínicas de ' + this.pacienteActual, 20, 20);
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    let yPosition = 40;
    this.historiaClinicaSeleccionada.forEach((historia: any) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`apellido: ${historia.apellido}`, 20, yPosition);
      yPosition += 10;
      doc.text(`nombre: ${historia.nombre}`, 20, yPosition);
      yPosition += 10;
      doc.text(`dni: ${historia.dni} kg`, 20, yPosition);
      yPosition += 10;
      doc.text(`obrasocial: ${historia.obrasocial} cm`, 20, yPosition);
      yPosition += 20;
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 5;
    });
    doc.save('usuarios_' + this.pacienteActual + '.pdf');
  }
}
