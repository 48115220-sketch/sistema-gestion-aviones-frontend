import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.css']
})
export class VuelosComponent implements OnInit {
  apiUrlVuelos = `http://${window.location.hostname}:8080/vuelos`;
  apiUrlAviones = `http://${window.location.hostname}:8080/aviones`;

  vuelos: any[] = [];
  aviones: any[] = [];

  numeroVuelo: string = '';
  codigo: string = '';
  origen: string = '';
  destino: string = '';
  horaSalida: string = '';
  fechaHora: string = '';
  avionId: number | null = null;

  modoEdicion: boolean = false;
  idSeleccionado: number | null = null;

  constructor(public apiService: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarVuelos();
    this.cargarAviones();
  }

  getHeaders(): HttpHeaders {
    return this.apiService.getHeaders();
  }

  cargarVuelos(): void {
    this.http.get(this.apiUrlVuelos, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.vuelos = data,
      error: (err) => {
        const msg = err.error?.message || 'Error al cargar los vuelos.';
        console.error(msg);
      }
    });
  }

  cargarAviones(): void {
    this.http.get(this.apiUrlAviones, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.aviones = data,
      error: (err) => {
        const msg = err.error?.message || 'Error al cargar los aviones.';
        console.error(msg);
      }
    });
  }

  guardarVuelo(): void {
    const valCodigo = this.codigo || this.numeroVuelo;
    const valHora = this.fechaHora || this.horaSalida;

    const dto = {
      numeroVuelo: valCodigo,
      origen: this.origen,
      destino: this.destino,
      horaSalida: valHora,
      avionId: this.avionId,
      estado: 'PROGRAMADO'
    };

    if (this.modoEdicion && this.idSeleccionado !== null) {
      this.http.put(`${this.apiUrlVuelos}/${this.idSeleccionado}`, dto, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarVuelos();
          this.limpiarFormulario();
        },
        error: (err) => {
          const msg = err.error?.message || 'Error al actualizar el vuelo.';
          Swal.fire({ title: 'Atención', text: msg, icon: 'warning', confirmButtonColor: '#0284c7' });
        }
      });
    } else {
      this.http.post(this.apiUrlVuelos, dto, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarVuelos();
          this.limpiarFormulario();
        },
        error: (err) => {
          const msg = err.error?.message || 'Error al guardar el vuelo.';
          Swal.fire({ title: 'Atención', text: msg, icon: 'warning', confirmButtonColor: '#0284c7' });
        }
      });
    }
  }

  cambiarEstadoVuelo(vuelo: any, nuevoEstado: string): void {
    const dto = {
      numeroVuelo: vuelo.numeroVuelo || vuelo.codigo,
      origen: vuelo.origen,
      destino: vuelo.destino,
      horaSalida: vuelo.horaSalida || vuelo.fechaHora,
      avionId: vuelo.avionId,
      estado: nuevoEstado
    };

    this.http.put(`${this.apiUrlVuelos}/${vuelo.id}`, dto, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarVuelos(),
      error: (err) => {
        const msg = err.error?.message || 'Error al cambiar el estado del vuelo.';
        Swal.fire({ title: 'Atención', text: msg, icon: 'warning', confirmButtonColor: '#0284c7' });
      }
    });
  }

  seleccionarParaEditar(vuelo: any): void {
    this.modoEdicion = true;
    this.idSeleccionado = vuelo.id;
    this.numeroVuelo = vuelo.numeroVuelo || vuelo.codigo || '';
    this.codigo = vuelo.codigo || vuelo.numeroVuelo || '';
    this.origen = vuelo.origen;
    this.destino = vuelo.destino;
    this.horaSalida = vuelo.horaSalida || vuelo.fechaHora || '';
    this.fechaHora = vuelo.fechaHora || vuelo.horaSalida || '';
    this.avionId = vuelo.avionId;
  }

  eliminarVuelo(id: number): void {
    this.http.delete(`${this.apiUrlVuelos}/${id}`, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarVuelos(),
      error: (err) => {
        const msg = err.error?.message || 'Error al eliminar el vuelo.';
        Swal.fire({ title: 'Atención', text: msg, icon: 'warning', confirmButtonColor: '#0284c7' });
      }
    });
  }

  obtenerNombreAvion(avionId: any): string {
    if (!avionId) return 'Sin Asignar';
    const a = this.aviones.find(item => item.id === Number(avionId));
    return a ? a.modelo : `AviÃ³n #${avionId}`;
  }

  limpiarFormulario(): void {
    this.modoEdicion = false;
    this.idSeleccionado = null;
    this.numeroVuelo = '';
    this.codigo = '';
    this.origen = '';
    this.destino = '';
    this.horaSalida = '';
    this.fechaHora = '';
    this.avionId = null;
  }
}