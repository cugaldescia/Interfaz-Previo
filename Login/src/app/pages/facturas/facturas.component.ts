import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FacturasService } from '../../services/facturas.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {
  referencia: string | null = '';
  dataSource = new MatTableDataSource<any>(); // DataSource para las facturas
  facturaSeleccionada: any | null = null;
  usuario: string | null = '';
  rfc: string | null = '';
  oficina: string | null = '';
  nombreusuario: string | null = '';
  isLoading = false;



  constructor(
    private dialog: MatDialog,
    private facturasService: FacturasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.referencia = localStorage.getItem('referencia');
    this.rfc = localStorage.getItem('rfc')|| '';
    this.oficina = localStorage.getItem('oficina')|| ''; 
    this.usuario = localStorage.getItem('usuario')|| ''; 
    this.nombreusuario = localStorage.getItem('nombre')|| '';
    if (!this.referencia) {
      console.error('Referencia no encontrada en el localStorage');
      return;
    }

    console.log('referencia:', this.referencia);
    this.obtenerFacturas(this.referencia);
    this.loadData();
  
  }

  obtenerFacturas(referencia: string): void {
    this.facturasService.getFacturas(referencia).subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.dataSource.data = response.length > 0 ? response : [];
          console.log('Facturas cargadas:', this.dataSource.data);
        } else {
          console.warn('La respuesta de la API no es válida:', response);
          this.dataSource.data = [];
        }
      },
      error: (error) => {
        console.error('Error al obtener las facturas:', error);
      }
    });
  }

  // Método para navegar al formulario de agregar factura
  navigateToRegistroFactura(): void {
    this.router.navigate(['/registro-facturas']);
  }

  onReferenciaClick(facturaData: any): void {
    if (!facturaData?.factura || !facturaData?.nombreProveedor) {
      console.warn('Datos incompletos para la referencia seleccionada:', facturaData);
      return;
    }
    this.facturaSeleccionada = facturaData;
    console.log('Factura seleccionada:', facturaData);

    // Guardar la referencia seleccionada en localStorage
    localStorage.setItem('factura', facturaData.factura);
    localStorage.setItem('nombreProveedor', facturaData.nombreProveedor);
    localStorage.setItem('id', facturaData.id);
    localStorage.setItem('proveedorId', facturaData.proveedorId);
    // Navegar a la página de facturas
    this.router.navigate(['/productos'], {
      queryParams: {
        factura: facturaData.factura,
        nombre: facturaData.nombreProveedor
      }
    });
  }
  setLocalStorage(){
    if (!this.referencia || !this.rfc || !this.oficina) {
      console.error('Referencia, RFC u oficina no encontrados en el localStorage');
      return;
    }
    localStorage.setItem('referencia', this.referencia || '');
    localStorage.setItem('rfc', this.rfc || '');
    localStorage.setItem('oficina', this.oficina || '');
    this.router.navigate(['/asignacion-referencias']);
    console.log('Valores almacenados en localStorage:', {
      referencia: localStorage.getItem('referencia'),
      rfc: localStorage.getItem('rfc'),
      oficina: localStorage.getItem('oficina')
    });
  }
  loadData(): void {
    this.isLoading = true;
    // Simular una llamada a la base de datos
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Simula 2 segundos de carga
  }
  referencias(){
    this.rfc = localStorage.getItem('rfc');
    this.router.navigate(['/asignacion-referencias']);
  }
  cerrarsesion(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  facturas(){
    this.router.navigate(['/facturas']);
  }
}
