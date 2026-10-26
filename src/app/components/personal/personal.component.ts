import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  apiUrl = `http://${window.location.hostname}:8080/admin/personal`;
  personal: any[] = [];

  get personalList(): any[] {
    return this.personal;
  }

  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  sueldo: number | null = null;
  cargo: string = '';
  tipo: string = 'PILOTO';

  modoEdicion: boolean = false;
  cargando: boolean = false;
  idSeleccionado: number | null = null;

  constructor(public apiService: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarPersonal();
  }

  getHeaders(): HttpHeaders {
    return this.apiService.getHeaders();
  }

  cargarPersonal() {
    this.http.get(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.personal = data,
      error: (err) => console.error('Error al cargar personal:', err)
    });
  }

  guardarPersonal() {
    this.cargando = true;
    const dto = {
      nombre: this.nombre,
      apellido: this.apellido,
      dni: this.dni,
      sueldo: this.sueldo,
      cargo: this.cargo,
      tipo: this.tipo
    };

    if (this.modoEdicion && this.idSeleccionado !== null) {
      this.http.put(`${this.apiUrl}/${this.idSeleccionado}`, dto, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarPersonal();
          this.limpiarFormulario();
          this.cargando = false;
        },
        error: () => { this.cargando = false; }
      });
    } else {
      this.http.post(this.apiUrl, dto, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarPersonal();
          this.limpiarFormulario();
          this.cargando = false;
        },
        error: () => { this.cargando = false; }
      });
    }
  }

  seleccionarParaEditar(p: any) {
    this.modoEdicion = true;
    this.idSeleccionado = p.id;
    this.nombre = p.nombre;
    this.apellido = p.apellido;
    this.dni = p.dni;
    this.sueldo = p.sueldo;
    this.cargo = p.cargo;
    this.tipo = p.tipo;
  }

  eliminarPersonal(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarPersonal()
    });
  }

  limpiarFormulario() {
    this.modoEdicion = false;
    this.idSeleccionado = null;
    this.nombre = '';
    this.apellido = '';
    this.dni = '';
    this.sueldo = null;
    this.cargo = '';
    this.tipo = 'PILOTO';
  }
}