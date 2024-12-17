import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EditarProductoService } from '../../services/editar-producto.service';
import { PaisService } from '../../services/pais.service';
import { UnidadService } from '../../services/unidad.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-editar-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-productos.component.html',
  styleUrls: ['./editar-productos.component.css']
})
export class EditarProductosComponent implements OnInit {
  productoId: string = '';
  facturaId: string = '';
  producto: string = '';
  descripcion: string = '';
  numeroSerie: string = '';
  isDefectuoso: string = '';
  paises: any[] = [];
  selectedpais: string = '';
  unidades: any[] = [];
  selectedunidad: string = '';
  cantidad: string = '';
  orden: string = '';
  observacionesProducto: string = '';
  peso: string = '';
  usuario: string = '';
  oficina: string = '';
  isLoading = false;
  nombreusuario: string | null = '';

  constructor(
    private editarProductoService: EditarProductoService,
    private router: Router,
    private paisService: PaisService,
    private unidadService: UnidadService
  ) {}

  ngOnInit(): void {
    this.cargarDatosGlobales();
    this.loadPais();
    this.loadUnidad();
    this.loadData();
    this.nombreusuario = localStorage.getItem('nombreUsuario') || '';
    
}

  cargarDatosGlobales() {
    this.usuario = localStorage.getItem('usuario') || '';
    this.oficina = localStorage.getItem('oficina') || '';
    this.productoId = localStorage.getItem('productoId') || '';
    this.facturaId = localStorage.getItem('id') || '';
    this.producto = localStorage.getItem('producto') || '';
    this.descripcion = localStorage.getItem('descripcion') || '';
    this.numeroSerie = localStorage.getItem('numeroSerie') || '';
    const estatus = localStorage.getItem('estatus');
    this.isDefectuoso = estatus === 'true' ? '1' : '0';
    this.selectedpais = localStorage.getItem('pais') || '';
    this.selectedunidad = localStorage.getItem('unidad') || '';
    this.cantidad = localStorage.getItem('cantidad') || '';
    this.orden = localStorage.getItem('orden') || '';
    this.observacionesProducto = localStorage.getItem('observaciones') || '';
    this.peso = localStorage.getItem('peso') || '';
  }

  loadPais() {
    const oficina = localStorage.getItem('oficina');
    const claveGuardada = localStorage.getItem('pais'); 
  
    if (oficina) {
      console.log("Cargando unidades para la oficina:", oficina);
  
      this.paisService.getPais(oficina).subscribe(
        (response) => {
          console.log('Datos unidad:', response);
  
          if (response && response.paises && Array.isArray(response.paises)) {
            this.paises = response.paises;
  
            if (this.paises.length > 0) {
              let paisSeleccionado = this.paises[0]; 

              if (claveGuardada) {
                const paisEncontrado = this.paises.find(pais => pais.clave == claveGuardada || pais.nombre == claveGuardada);
                if (paisEncontrado) {
                  paisSeleccionado = paisEncontrado;
                } else {
                  // Si no se encuentra la clave ni la descripción, crear una nueva unidad
                  const nuevoPais = { clave: claveGuardada, nombre: 'Descripción no disponible' };
                  this.paises.push(nuevoPais);
                  paisSeleccionado = nuevoPais;
                }
              }
  
              const { nombre, clave } = paisSeleccionado;
  
              if (nombre && clave) {

                this.selectedpais = `${clave} - ${nombre}`;
              } else {
                console.warn('Descripción no encontrada para la clave:', clave);
                this.selectedpais = `${clave} - Descripción no disponible`;
              }
  
              console.log('Opción seleccionada:', this.selectedpais);
            }
          } else {
            console.warn('Estructura de datos inválida o vacía:', response);
          }
        },
        (error) => {
          console.error('Error al cargar unidades:', error);
        }
      );
    } else {
      console.warn('No se encontró la oficina en localStorage.');
    }
  }

loadUnidad() {
    const oficina = localStorage.getItem('oficina');
    const claveGuardada = localStorage.getItem('unidad'); // Obtener la clave guardada
  
    if (oficina) {
      console.log("Cargando unidades para la oficina:", oficina);
  
      this.unidadService.getUnidad(oficina).subscribe(
        (response) => {
          console.log('Datos unidad:', response);
  
          if (response && response.unidades && Array.isArray(response.unidades)) {
            this.unidades = response.unidades;
  
            if (this.unidades.length > 0) {
              let unidadSeleccionada = this.unidades[0]; // Por defecto, la primera opción
  
              // Buscar la clave guardada en la lista de unidades
              if (claveGuardada) {
                const unidadEncontrada = this.unidades.find(unidad => unidad.clave == claveGuardada || unidad.descripcion == claveGuardada);
                if (unidadEncontrada) {
                  unidadSeleccionada = unidadEncontrada;
                } else {
                  // Si no se encuentra la clave ni la descripción, crear una nueva unidad
                  const nuevaUnidad = { clave: claveGuardada, descripcion: 'Descripción no disponible' };
                  this.unidades.push(nuevaUnidad);
                  unidadSeleccionada = nuevaUnidad;
                }
              }
  
              const { descripcion, clave } = unidadSeleccionada;
  
              // Verificar si la descripción está definida
              if (descripcion && clave) {
                // Selecciona la opción encontrada o la primera opción automáticamente
                this.selectedunidad = `${clave} - ${descripcion}`;
              } else {
                console.warn('Descripción no encontrada para la clave:', clave);
                this.selectedunidad = `${clave} - Descripción no disponible`;
              }
  
              console.log('Opción seleccionada:', this.selectedunidad);
            }
          } else {
            console.warn('Estructura de datos inválida o vacía:', response);
          }
        },
        (error) => {
          console.error('Error al cargar unidades:', error);
        }
      );
    } else {
      console.warn('No se encontró la oficina en localStorage.');
    }
  }
  
    
  guardar(): void {
    const selectedProv = this.selectedpais.split(' - ');
    const selecteduni = this.selectedunidad.split(' - ');
    console.log('Valor de isDefectuoso:', this.isDefectuoso); 

    const data = {
      productoId: this.productoId,
      facturaId: this.facturaId,
      producto: this.producto,
      descripcion: this.descripcion,
      numeroSerie: this.numeroSerie,
      isDefectuoso: this.isDefectuoso === '1' ? 1 : 0,
      pais: selectedProv[0],
      unidad: selecteduni[0],
      cantidad: this.cantidad,
      orden: this.orden,
      observacionesProducto: this.observacionesProducto,
      peso: this.peso
    };

    this.editarProductoService.patchProducto(data).subscribe(
      response => {
        console.log('Datos guardados exitosamente:', response);
        this.router.navigate(['/productos']);
      },
      error => {
        console.error('Error al guardar datos:', error);
        alert(`Error al guardar datos: ${error.message}`);
      }
    );
  }

  cancelar() {
    this.router.navigate(['/productos']);
  }
  cerrarsesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  Productos() {
    this.router.navigate(['/productos']);
  }
  referencias() {
    this.router.navigate(['/asignacion-referencias']);
  }
  facturas() {
    this.router.navigate(['/facturas']);
  }
  loadData(): void {
    this.isLoading = true;
    // Simular una llamada a la base de datos
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Simula 2 segundos de carga
  }
}