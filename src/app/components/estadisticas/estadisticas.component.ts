import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TurnosService } from '../../services/turnos/turnos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [ChartModule, CommonModule, FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {
  // Datos para gráficos
  chartDataUsuarios: any;
  chartDataEspecialidad: any;
  chartDataTurnos: any;
  chartDataMedicos: any;  // Nuevo gráfico de médicos
  chartDataTurnosFinalizados: any;  // Nuevo gráfico de turnos finalizados
  chartOptions: any;

  usuariosArray: any[] = [];
  especialidadesArray: any[] = [];
  turnosArray: any[] = [];
  medicosArray: any[] = [];  // Para almacenar los datos de los médicos
  turnosFinalizadosArray: any[] = [];  // Para almacenar los datos de los turnos finalizados

  logsUsuarios: string[] = [];
  logsTurnos: string[] = []; // Separa los logs de turnos y usuarios

  constructor(private turnos: TurnosService) {}

  ngOnInit(): void {
    this.dataUsuarios();
    this.dataEspecialidad();
    this.dataTurnosDia();
    this.datamedicosTurno();  // Llamamos al método para obtener datos de médicos
    this.dataTurnosFinalizados();  // Llamamos al método para obtener turnos finalizados
    this.initializeCharts();
  }

  // Obtener logs de usuarios
  dataUsuarios() {
    this.turnos.getLogsLogin().subscribe({
      next: (data: any[]) => {
        this.logsUsuarios = data.map((log: any) => `Usuario: ${log.usuario}, Día: ${log.dia}, Horario: ${log.horario}`);
        this.updateChartUsuarios(); // Actualiza los gráficos cuando los datos se reciban
      },
      error: (err) => {
        console.error('Error al obtener logs de usuarios:', err);
      },
    });
  }

  // Obtener logs de turnos médicos
  datamedicosTurno() {
    this.turnos.getLogTurnoMedico().subscribe({
      next: (data: any[]) => {
        this.medicosArray = data.map((log: any) => log.medico);
        this.updateChartMedicos(); // Actualiza los gráficos cuando los datos se reciban
      },
      error: (err) => {
        console.error('Error al obtener logs de turnos médicos:', err);
      },
    });
  }

  // Obtener turnos finalizados
  dataTurnosFinalizados() {
    this.turnos.getLogTurnoFinalizado().subscribe({
      next: (data: any[]) => {
        this.turnosFinalizadosArray = data.map((log: any) => ({ dia: log.dia, medico: log.medico }));
        this.updateChartTurnosFinalizados(); // Actualiza el gráfico de turnos finalizados
      },
      error: (err) => {
        console.error('Error al obtener turnos finalizados:', err);
      },
    });
  }

  // Datos para el gráfico de turnos por día
  dataTurnosDia() {
    this.turnos.getLogTurnoPorDia().subscribe({
      next: (data: any[]) => {
        this.turnosArray = data.map((log: any) => ({ dia: log.dia }));
        this.updateChartTurnos(); // Actualiza los gráficos cuando los datos se reciban
      },
      error: (err) => {
        console.error('Error al obtener turnos por día:', err);
      },
    });
  }

  // Datos para el gráfico de especialidades
  dataEspecialidad() {
    this.turnos.getLogEspecialidad().subscribe({
      next: (data: any[]) => {
        this.especialidadesArray = data.map((log: any) => ({ dia: log.dia, especialidad: log.especialidad }));
        this.updateChartEspecialidad(); // Actualiza los gráficos cuando los datos se reciban
      },
      error: (err) => {
        console.error('Error al obtener logs de especialidades:', err);
      },
    });
  }

  // Configuración inicial de los gráficos
  initializeCharts() {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };

    this.chartDataUsuarios = { labels: [], datasets: [] };
    this.chartDataEspecialidad = { labels: [], datasets: [] };
    this.chartDataTurnos = { labels: [], datasets: [] };
    this.chartDataMedicos = { labels: [], datasets: [] };  // Inicializamos el gráfico de médicos
    this.chartDataTurnosFinalizados = { labels: [], datasets: [] }; // Inicializamos el gráfico de turnos finalizados
  }

  // Actualizar gráfico de usuarios
  updateChartUsuarios() {
    const usuarios = this.usuariosArray.map((log) => log.usuario);
    const ingresosPorUsuario = usuarios.reduce((acc: any, usuario: string) => {
      acc[usuario] = (acc[usuario] || 0) + 1;
      return acc;
    }, {});

    this.chartDataUsuarios = {
      labels: Object.keys(ingresosPorUsuario),
      datasets: [
        {
          label: 'Cantidad de Ingresos por Usuario',
          data: Object.values(ingresosPorUsuario),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#FFA726'],
          borderColor: '#1E88E5',
          borderWidth: 1,
        },
      ],
    };
  }

  // Actualizar gráfico de especialidades
  updateChartEspecialidad() {
    const especialidades = this.especialidadesArray.map((log) => log.especialidad);
    const turnosPorEspecialidad = especialidades.reduce((acc: any, especialidad: string) => {
      acc[especialidad] = (acc[especialidad] || 0) + 1;
      return acc;
    }, {});
  
    this.chartDataEspecialidad = {
      labels: Object.keys(turnosPorEspecialidad), // Especialidades
      datasets: [
        {
          label: 'Cantidad de Turnos por Especialidad',
          data: Object.values(turnosPorEspecialidad), // Cantidad de turnos
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#FFA726'],
          borderColor: '#1E88E5',
          borderWidth: 1,
        },
      ],
    };
  }

  // Actualizar gráfico de turnos por día
  updateChartTurnos() {
    const dias = this.turnosArray.map((log) => log.dia);
    const turnosPorDia = dias.reduce((acc: any, dia: string) => {
      acc[dia] = (acc[dia] || 0) + 1;
      return acc;
    }, {});

    this.chartDataTurnos = {
      labels: Object.keys(turnosPorDia),
      datasets: [
        {
          label: 'Cantidad de Turnos por Día',
          data: Object.values(turnosPorDia),
          backgroundColor: ['#66BB6A', '#FFA726', '#42A5F5', '#FF6384', '#36A2EB'],
          borderColor: '#1E88E5',
          borderWidth: 1,
        },
      ],
    };
  }

  // Actualizar gráfico de turnos médicos
  updateChartMedicos() {
    const medicos = this.medicosArray;
    const turnosPorMedico = medicos.reduce((acc: any, medico: string) => {
      acc[medico] = (acc[medico] || 0) + 1;
      return acc;
    }, {});

    this.chartDataMedicos = {
      labels: Object.keys(turnosPorMedico),
      datasets: [
        {
          label: 'Cantidad de Turnos por Médico',
          data: Object.values(turnosPorMedico),
          backgroundColor: ['#42A5F5', '#FF6384', '#36A2EB', '#FFCE56', '#FFA726'],
          borderColor: '#1E88E5',
          borderWidth: 1,
        },
      ],
    };
  }

  // Actualizar gráfico de turnos finalizados
  updateChartTurnosFinalizados() {
    const turnos = this.turnosFinalizadosArray;
    
    // Agrupar los turnos finalizados por médico
    const turnosFinalizadosPorMedico = turnos.reduce((acc: any, turno: any) => {
      acc[turno.medico] = (acc[turno.medico] || 0) + 1;
      return acc;
    }, {});
  
    // Actualizar los datos del gráfico
    this.chartDataTurnosFinalizados = {
      labels: Object.keys(turnosFinalizadosPorMedico),  // Nombres de los médicos
      datasets: [
        {
          label: 'Turnos Finalizados por Médico',
          data: Object.values(turnosFinalizadosPorMedico),  // Cantidad de turnos por médico
          backgroundColor: ['#66BB6A', '#FFA726', '#42A5F5', '#FF6384', '#36A2EB'],
          borderColor: '#1E88E5',
          borderWidth: 1,
        },
      ],
    };
  }

  downloadPDF() {
  }

}
