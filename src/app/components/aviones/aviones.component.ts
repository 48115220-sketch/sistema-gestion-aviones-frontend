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
  capacidadPersonas: number = 180;
  capacidadEquipaje: number = 5000;
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

  cargarAviones() {
    this.http.get(this.apiUrlAviones, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.aviones = data,
      error: (err) => console.error('Error al cargar aviones:', err)
    });
  }

  cargarPersonal() {
    this.http.get(this.apiUrlPersonal, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.personalList = data,
      error: (err) => console.error('Error al cargar personal:', err)
    });
  }

  guardarAvion() {
    const dto = {
      modelo: this.modelo,
      capacidadPersonas: this.capacidadPersonas,
      capacidadEquipaje: this.capacidadEquipaje,
      personalId: this.personalId
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
        error: (err) => console.error('Error al crear avión:', err)
      });
    }
  }

  seleccionarParaEditar(avion: any) {
    this.modoEdicion = true;
    this.idSeleccionado = avion.id;
    this.modelo = avion.modelo;
    this.capacidadPersonas = avion.capacidadPersonas;
    this.capacidadEquipaje = avion.capacidadEquipaje;
    this.personalId = avion.personalId;
  }

  eliminarAvion(id: number) {
    this.http.delete(`${this.apiUrlAviones}/${id}`, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarAviones(),
      error: (err) => console.error('Error al eliminar avión:', err)
    });
  }

  obtenerNombrePersonal(id: number): string {
    if (!id) return 'Sin asignar';
    const p = this.personalList.find(item => item.id === id);
    return p ? `${p.nombre} ${p.apellido}` : `Personal #${id}`;
  }

  limpiarFormulario() {
    this.modoEdicion = false;
    this.idSeleccionado = null;
    this.modelo = '';
    this.capacidadPersonas = 180;
    this.capacidadEquipaje = 5000;
    this.personalId = null;
  }
}