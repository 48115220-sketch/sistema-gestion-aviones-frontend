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
  origen: string = '';
  destino: string = '';
  horaSalida: string = '';
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
      error: (err) => console.error('Error al cargar vuelos:', err)
    });
  }

  cargarAviones(): void {
    this.http.get(this.apiUrlAviones, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.aviones = data,
      error: (err) => console.error('Error al cargar aviones:', err)
    });
  }

  guardarVuelo(): void {
    const dto = {
      numeroVuelo: this.numeroVuelo,
      origen: this.origen,
      destino: this.destino,
      horaSalida: this.horaSalida,
      avionId: this.avionId
    };

    if (this.modoEdicion && this.idSeleccionado !== null) {
      this.http.put(`${this.apiUrlVuelos}/${this.idSeleccionado}`, dto, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarVuelos();
          this.limpiarFormulario();
        },
        error: (err) => console.error('Error al actualizar vuelo:', err)
      });
    } else {
      this.http.post(this.apiUrlVuelos, dto, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarVuelos();
          this.limpiarFormulario();
        },
        error: (err) => console.error('Error al guardar vuelo:', err)
      });
    }
  }

  seleccionarParaEditar(vuelo: any): void {
    this.modoEdicion = true;
    this.idSeleccionado = vuelo.id;
    this.numeroVuelo = vuelo.numeroVuelo || vuelo.nombre;
    this.origen = vuelo.origen;
    this.destino = vuelo.destino;
    this.horaSalida = vuelo.horaSalida;
    this.avionId = vuelo.avionId;
  }

  eliminarVuelo(id: number): void {
    this.http.delete(`${this.apiUrlVuelos}/${id}`, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarVuelos(),
      error: (err) => console.error('Error al eliminar vuelo:', err)
    });
  }

  obtenerNombreAvion(avionId: any): string {
    if (!avionId) return 'Sin Asignar';
    const a = this.aviones.find(item => item.id === Number(avionId));
    return a ? a.modelo : `Avión #${avionId}`;
  }

  limpiarFormulario(): void {
    this.modoEdicion = false;
    this.idSeleccionado = null;
    this.numeroVuelo = '';
    this.origen = '';
    this.destino = '';
    this.horaSalida = '';
    this.avionId = null;
  }
}