import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-aviones',
  templateUrl: './aviones.component.html',
  styleUrls: ['./aviones.component.css']
})
export class AvionesComponent implements OnInit {
  apiUrlAviones = `http://${window.location.hostname}:8080/aviones`;
  apiUrlPersonal = `http://${window.location.hostname}:8080/admin/personal`;

  aviones: any[] = [];
  personalList: any[] = [];

  modelo: string = '';
  capacidadPersonas: number | null = 180;
  capacidadEquipaje: number | null = 5000;
  personalId: number | null = null;

  modoEdicion: boolean = false;
  idSeleccionado: number | null = null;

  constructor(public apiService: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarAviones();
    this.cargarPersonal();
  }

  getHeaders(): HttpHeaders {
    return this.apiService.getHeaders();
  }

  cargarAviones(): void {
    this.http.get(this.apiUrlAviones, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.aviones = data,
      error: (err) => console.error('Error al cargar aviones:', err)
    });
  }

  cargarPersonal(): void {
    this.http.get(this.apiUrlPersonal, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.personalList = data,
      error: (err) => console.error('Error al cargar personal:', err)
    });
  }

  guardarAvion(): void {
    const dto = {
      modelo: this.modelo,
      capacidadPersonas: this.capacidadPersonas,
      capacidadEquipaje: this.capacidadEquipaje,
      personalId: this.personalId,
      estado: 'EN_SERVICIO'
    };

    if (this.modoEdicion && this.idSeleccionado !== null) {
      this.http.put(`${this.apiUrlAviones}/${this.idSeleccionado}`, dto, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarAviones();
          this.limpiarFormulario();
        },
        error: (err) => console.error('Error al actualizar avión:', err)
      });
    } else {
      this.http.post(this.apiUrlAviones, dto, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarAviones();
          this.limpiarFormulario();
        },
        error: (err) => console.error('Error al guardar avión:', err)
      });
    }
  }

  cambiarEstadoAvion(avion: any, nuevoEstado: string): void {
    const dto = {
      modelo: avion.modelo,
      capacidadPersonas: avion.capacidadPersonas,
      capacidadEquipaje: avion.capacidadEquipaje,
      personalId: avion.personalId,
      estado: nuevoEstado
    };

    this.http.put(`${this.apiUrlAviones}/${avion.id}`, dto, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarAviones(),
      error: (err) => console.error('Error al actualizar estado del avión:', err)
    });
  }

  seleccionarParaEditar(avion: any): void {
    this.modoEdicion = true;
    this.idSeleccionado = avion.id;
    this.modelo = avion.modelo;
    this.capacidadPersonas = avion.capacidadPersonas;
    this.capacidadEquipaje = avion.capacidadEquipaje;
    this.personalId = avion.personalId;
  }

  obtenerNombrePersonal(personalId: any): string {
    if (!personalId) return 'Sin Asignar';
    const p = this.personalList.find(item => item.id === Number(personalId));
    return p ? `${p.nombre} ${p.apellido}` : `Personal #${personalId}`;
  }

  limpiarFormulario(): void {
    this.modoEdicion = false;
    this.idSeleccionado = null;
    this.modelo = '';
    this.capacidadPersonas = 180;
    this.capacidadEquipaje = 5000;
    this.personalId = null;
  }
}