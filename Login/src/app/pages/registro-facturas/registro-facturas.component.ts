import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RegistroFPService } from '../../services/registro-fp.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
  selector: 'app-registro-facturas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],  
  templateUrl: './registro-facturas.component.html',
  styleUrls: ['./registro-facturas.component.css'] 
})
export class RegistroFacturasComponent implements OnInit {
  referencias: string = '';        
  nombre: string = '';            
  factura: string = '';            
  observacionesPrevio: string = ''; 
  proveedores: any[] = [];         
  selectedProveedor: string = '';   
  identificador: string = '';              
  oficina: string = '';            
  cliente: string ='';
  showSuccessModal: boolean = false
  constructor(private registroFPService: RegistroFPService, private router: Router, private proveedoresServices:ProveedoresService) {}

  ngOnInit(): void {
    this.cargarDatosGlobales();
    this.loadProveedores();
  }

  cargarDatosGlobales() {
    this.nombre = localStorage.getItem('nombre') || '';
    this.referencias = localStorage.getItem('referencia') || ''; 
    this.identificador = localStorage.getItem('rfc') || ''; 
    this.oficina = localStorage.getItem('oficina') || '';
    this.cliente= localStorage.getItem('cliente') || '';
  }

  loadProveedores() {
    const rfc = localStorage.getItem('rfc');
    const oficina = localStorage.getItem('oficina');
    if (rfc && oficina) {
      console.log("rrr")
      this.proveedoresServices.getProveedor(rfc, oficina).subscribe(
        (data) => {
          console.log('Datos de proveedores:', data);
          this.proveedores = data.map((prov: any) => ({
            clave: prov.clave,
            nombre: prov.nombre,
            identificador: prov.identificador
          }));
          console.log(this.proveedores)
        },
        (error) => {
          console.error('Error al cargar proveedores:', error);
        }
      );
      
    }else console.log(rfc && oficina)
  }

  agregar() {
    if (this.factura.trim() === '') {
      alert('El campo factura es obligatorio');
      return;
    }
    if (this.observacionesPrevio.trim() === '') {
      alert('El campo observaciones es obligatorio');
      return;
    }
  
    const selectedProv = this.selectedProveedor.split(' - ');
    if (selectedProv.length < 2) {
      alert('Debe seleccionar un proveedor válido');
      return;
    }
  
    const data = {
      referencia: this.referencias,
      cliente: this.cliente,
      nombreCliente: this.nombre,
      proveedor: selectedProv[0],
      nombreProveedor: selectedProv[1],
      taxId: this.identificador,
      factura: this.factura,
      observacionesPrevio: this.observacionesPrevio
    };
  
    console.log('Datos a enviar:', data);
  
    this.registroFPService.registrar(data).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        this.showSuccessModal = true; // Mostrar modal de éxito
        this.resetForm();
      },
      (error) => {
        console.error('Error al guardar datos:', error);
        const errorMessage = error.error?.message || error.message || 'Error desconocido';
        alert(`Error al guardar datos: ${errorMessage}`);
      }
    );
  }
  closeModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/registro-facturas']); // Redirige después de cerrar
  }

  resetForm() {
    this.factura = '';
    this.observacionesPrevio = '';
    this.selectedProveedor = '';
  }

  cancelar() {
    this.router.navigate(['/facturas']); 
  }
}