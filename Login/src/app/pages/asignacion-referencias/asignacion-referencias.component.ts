import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReferenciasService } from '../../services/referencias.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { NoConformidadbitacoraService } from '../../services/no-conformidadbitacora.service';
import { BitacoraService } from '../../services/bitacora.service';
import { ClasificacionMailService } from '../../services/clasificacion-mail.service';


@Component({
  selector: 'app-asignacion-referencias',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './asignacion-referencias.component.html',
  styleUrls: ['./asignacion-referencias.component.css']
})
export class AsignacionReferenciasComponent implements OnInit {
  referenciaSeleccionada: any | null = null; // Variable para rastrear la referencia seleccionada
  showModal = false; // Controla si se muestra el modal
  userData= new MatTableDataSource<any>(); // DataSource para las referencias
  rfc: string | null = '';
  oficinas: string | null = '';
  usuario: string | null = '';
  nombreusuario: string | null = '';
  isLoading = false;
  

  constructor(
    private dialog: MatDialog,
    private referenciasService: ReferenciasService,
    private router: Router,
    private noConformidadbitacoraService: NoConformidadbitacoraService, // Inyecta el servicio
    private bitacoraService: BitacoraService, // Inyecta el servicio
    private clasificacionMailService: ClasificacionMailService // Inyecta el servicio
  
  
  ) {}

  ngOnInit(): void {
  this.rfc = localStorage.getItem('rfc');
  this.oficinas = localStorage.getItem('oficinas');
  this.usuario = localStorage.getItem('usuario');
  this.nombreusuario = localStorage.getItem('nombreUsuario');

  if (!this.rfc || !this.oficinas) {
    console.error('RFC u oficina no encontrados en el localStorage');
    return;
  }

  console.log('RFC:', this.rfc);
  console.log('Oficina:', this.oficinas);
  console.log('Usuario', this.usuario);

  this.obtenerReferencias(this.rfc, this.oficinas);
  this.loadData();
}

  obtenerReferencias(rfc: string, oficina: string): void {
    this.referenciasService.getReferencias(rfc, oficina).subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.userData.data = response.length > 0 ? response : [];
          console.log('Referencias cargadas:', this.userData.data);
        } else {
          console.warn('La respuesta de la API no es válida:', response);
          this.userData.data = [];
        }
      },
      error: (error) => {
        console.error('Error al obtener las referencias:', error);
      }
    });
  }

  onReferenciaClick(referenciaData: any): void {
    if (!referenciaData?.referencia || !referenciaData?.nombre) {
      console.warn('Datos incompletos para la referencia seleccionada:', referenciaData);
      return;
    }
    this.referenciaSeleccionada = referenciaData;
    console.log('Referencia seleccionada:', referenciaData);
  
    localStorage.setItem('referencia', referenciaData.referencia);
    localStorage.setItem('nombre', referenciaData.nombre);
    localStorage.setItem('rfcReferencia', referenciaData.rfc);
    localStorage.setItem('cliente', referenciaData.cliente);
    console.log('cliente:', referenciaData.cliente);
  
  
    // Navegar a la página de facturas
    this.router.navigate(['/facturas'], {
      queryParams: {
        referencia: referenciaData.referencia,
        nombre: referenciaData.nombre
      }
    });
  }
  terminarReferencia(referenciaData: any): void {
    console.log('Terminando referencia:', referenciaData);
    this.referenciaSeleccionada = referenciaData; // Marca la referencia como seleccionada
  
    // Pedir observaciones al usuario
    const observaciones = prompt('Ingrese observaciones:');
  
    // Consumir el servicio de no conformidad
    this.noConformidadbitacoraService.getnoconforme(referenciaData.referencia).subscribe({
      next: (response) => {
        console.log('Respuesta del servicio de no conformidad:', response);
  
        // Determinar conformidad
        const conformidad = response.noConformidad === 0 ? 'Conformidad' : 'No Conformidad';
  
        // Crear entrada de bitácora
        const bitacoraEntry = {
          referencia: referenciaData.referencia,
          conformidad: conformidad,
          observaciones: observaciones,
          usuario: this.usuario,
          oficina: this.oficinas
        };
  
        // Guardar en bitácora
        this.bitacoraService.guardarBitacora(bitacoraEntry).subscribe({
          next: (bitacoraResponse) => {
            console.log('Bitácora guardada exitosamente:', bitacoraResponse);
          },
          error: (bitacoraError) => {
            console.error('Error al guardar en bitácora:', bitacoraError);
          }
        });
      },
      error: (error) => {
        console.error('Error al consumir el servicio de no conformidad:', error);
      }
    });
}

mandarCorreo(referenciaData: any): void {
  console.log('Productos no clasificados:', referenciaData);
  this.referenciaSeleccionada = referenciaData; 

  const clasificacionentry = {
    referencia: referenciaData.referencia,
    oficina: this.oficinas
  };

  this.clasificacionMailService.mandarMail(clasificacionentry).subscribe({
    next: (mailresponse) => {
      try {
        const parsedResponse = this.isJsonString(mailresponse) ? JSON.parse(mailresponse) : mailresponse;
        console.log('Mail mandado exitosamente', parsedResponse);
      } catch (e) {
        console.error('Error al parsear la respuesta del mail:', e);
        console.log('Respuesta del servicio de mail (sin parsear):', mailresponse);
      }
    },
    error: (mailError) => {
      console.error('Error al mandar el mail:', mailError);
    }
  });
}

isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
loadData(): void {
  this.isLoading = true;
  
  setTimeout(() => {
    this.isLoading = false;
  }, 2000);
}
cerrarSesion(): void {
  localStorage.clear();
  this.router.navigate(['/login']);
}
Referencias(): void {
  this.router.navigate(['/asignacion-referencias']);
}
}
