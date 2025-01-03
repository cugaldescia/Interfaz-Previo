import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RegistroproductosService } from '../../services/registroproductos.service';
import { PaisService } from '../../services/pais.service';
import { UnidadService } from '../../services/unidad.service';
import { ConformidadService } from '../../services/conformidad.service'; // Importa el servicio de conformidad
import { ValidacionService } from '../../services/validacion.service';
import { NoclasificadoService } from '../../services/noclasificado.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-registro-productos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, MatTooltipModule],
  templateUrl: './registro-productos.component.html',
  styleUrls: ['./registro-productos.component.css']
})
export class RegistroProductosComponent implements OnInit {
  facturaId: string = '';        
  producto: string = '';            
  descripcion: string = '';            
  numeroSerie: string = '';            
  isDefectuoso: string = ''; 
  paises:  any[] = []; 
  selectedpais: string='';        
  unidades:  any[] = [];   
  selectedunidad: string='';        
  cantidad: string = ''; 
  orden: string = ''; 
  observacionesProducto: string = ''; 
  peso: string = '';              
  showSuccessModal: boolean = false;
  idfact: string='';
  usuario: string='';
  referencia: string='';
  idBitacora: string='';
  validacionProductoMensaje: string = '';
  validacionProductoClase: string = '';
  usoMercancia: string = ''; // Nueva variable
  estadoMercancia: string = ''; // Nueva variable
  presentacionComposicion: string = ''; // Nueva variable
  isProductoClasificado: boolean = false; // Nueva variable
  marca: string = ''; // Nueva variable
  modelo: string = ''; // Nueva variable
  clienteC: string = ''; // Nueva variable
  proveedorC: string = ''; // Nueva variable
  oficinas: string = ''; // Nueva variable
  nombre: string = ''; // Nueva variable
  factura: string = ''; // Nueva variable
  isloading = false;
  mostrarCamposAdicionales: boolean = false; // Nueva variable para mostrar campos adicionales
  nombreusuario: string | null = '';

  constructor(
    private registroPService: RegistroproductosService,
    private router: Router, 
    private paisService: PaisService,
    private unidadService: UnidadService,
    private validacionService: ValidacionService, // Inyecta el servicio de validación
    private noclasificadoService: NoclasificadoService
    

  ) {}

  ngOnInit(): void {
    this.cargarDatosGlobales();
    this.loadUnidad();
    this.loadData();
    this.nombreusuario = localStorage.getItem('nombreUsuario') || '';
    
  }

  
  agregarNoclasificado(): void {
    const selectedPaisClave = this.selectedpais;  // Obtener solo la clave del país

    const data = {
      referencia: this.referencia,
      claveCliente: this.clienteC,
      claveProveedor: this.proveedorC,
      producto: this.producto,
      descripcion: this.descripcion,
      usoMercancia: this.usoMercancia,
      estadoMercancia: this.estadoMercancia,
      clavePais: selectedPaisClave,  // Guardar solo la clave del país
      claveUnidadMedida: this.selectedunidad.split(' - ')[0],  // Guardar solo la clave de la unidad de medida
      marca: this.marca,
      modelo: this.modelo,
      presentacionComposicion: this.presentacionComposicion,
      oficina: this.oficinas,
      usuario: this.usuario
    };
    if (this.isProductoClasificado) {
      this.noclasificadoService.registrarClasificacion(data).subscribe(
        response => {
          console.log('Producto clasificado registrado:', response);
          this.showSuccessModal = true;
        },
        error => {
          console.error('Error al registrar producto clasificado:', error);
        }
      );
    } 
    console.log('Datos a enviar:', data);
}

 validarProducto() {
    if (this.producto.trim() === '') {
      alert('El campo producto es obligatorio');
      return;
    }

    this.validacionService.validarProducto(this.producto).subscribe(
      response => {
        console.log('Respuesta de la API de validación:', response); // Verifica la respuesta de la API
        if (response && response.status !== undefined) {
          if (response.status === 'OK') {
            this.validacionProductoMensaje = 'El producto está clasificado.';
            this.validacionProductoClase = 'validado';
            this.isProductoClasificado = true;
            this.mostrarCamposAdicionales = false; // Ocultar campos adicionales
          } else {
            this.validacionProductoMensaje = 'Error al procesar la respuesta.';
            this.validacionProductoClase = 'no-validado';
            this.isProductoClasificado = false;
            this.mostrarCamposAdicionales = true; // Mostrar campos adicionales
            this.agregarNoclasificado(); // Agregar producto no clasificado
          }
        } else {
          this.validacionProductoMensaje = 'El producto no está clasificado.';
          this.validacionProductoClase = 'no-validado';
          this.isProductoClasificado = false;
          this.mostrarCamposAdicionales = true; // Mostrar campos adicionales
          this.agregarNoclasificado(); // Agregar producto no clasificado
        }
      },
      error => {
        console.error('Error al validar el producto', error);
        this.validacionProductoMensaje = 'Error al validar el producto.';
        this.validacionProductoClase = 'no-validado';
        this.isProductoClasificado = false;
        this.mostrarCamposAdicionales = true; // Mostrar campos adicionales
        this.agregarNoclasificado(); // Agregar producto no clasificado
      }
    );
  }

  
  
  loadUnidad() {
    const oficinas = localStorage.getItem('oficinas');
    if (oficinas) {
      console.log("Cargando unidades...");
      this.unidadService.getUnidad(oficinas).subscribe(
        (response) => {
          console.log('Datos Unidad:', response);
          this.unidades = response.unidades;
  
          if (this.unidades && this.unidades.length > 0) {
            const { descripcion, clave } = this.unidades[0];
            localStorage.setItem('descripcion', descripcion);
            localStorage.setItem('clave', clave);
  
            // Selecciona la primera opción automáticamente
            this.selectedunidad = `${clave} - ${descripcion}`;
          }
  
          console.log(this.unidades);
        },
        (error) => {
          console.error('Error al cargar unidades', error);
        }
      );
    }
  }
  
  
  cargarDatosGlobales() {
    // Cargar datos desde el localStorage
    this.idfact = localStorage.getItem('id') || ''; 
    this.usuario = localStorage.getItem('usuario') || '';
    this.referencia = localStorage.getItem('referencia') || '';
    this.idBitacora = localStorage.getItem('idBitacora') || ''; 
    this.clienteC = localStorage.getItem('cliente') || ''; // Carga el cliente desde el localStorage
    this.proveedorC = localStorage.getItem('proveedorId') || ''; // Carga el proveedor desde el localStorage
    this.oficinas = localStorage.getItem('oficinas') || ''; // Carga la oficina desde el localStorage
    this.nombre = localStorage.getItem('nombre') || ''; // Carga el nombre desde el localStorage
    this.factura = localStorage.getItem('factura') || ''; // Carga la factura desde el localStorage
    console.log('Datos cargados desde localStorage:');
    console.log('ID Factura:', this.idfact);
    console.log('Usuario:', this.usuario);
    console.log('Referencia:', this.referencia);
    console.log('ID Bitacora:', this.idBitacora); // Verifica que esté correctamente asignado

  }

  // ...existing code...
  agregar() {
    // Validación de campos
    if (this.producto.trim() === '') {
      alert('El campo producto es obligatorio');
      return;
    }
    if (this.descripcion.trim() === '') {
      alert('El campo descripción es obligatorio');
      return;
    }
    if (this.numeroSerie.trim() === '') {
      alert('El campo número de serie es obligatorio');
      return;
    }
    if (this.cantidad.trim() === '') {
      alert('El campo cantidad es obligatorio');
      return;
    }
    if (this.orden.trim() === '') {
      alert('El campo orden es obligatorio');
      return;
    }
    if (this.observacionesProducto.trim() === '') {
      alert('El campo observaciones es obligatorio');
      return;
    }
    if (this.peso.trim() === '') {
      alert('El campo peso es obligatorio');
      return;
    }
    const selectedProv = this.selectedpais.split(' - ')[0]; // Extraer solo el número del país
    if (selectedProv.length < 0) {
      alert('Debe seleccionar un pais válido');
      return;
    }
    const selecteduni = this.selectedunidad.split(' - ');
    if (selecteduni.length < 2) {
      alert('Debe seleccionar una Unidad válida');
      return;
    }
  
    // Aseguramos que isDefectuoso sea 1 o 0
    const isDefectuosoValue = this.isDefectuoso === '1' ? 1 : 0;
  
    const data = {
      facturaId: this.idfact,
      producto: this.producto,
      descripcion: this.descripcion,
      numeroSerie: this.numeroSerie,
      isDefectuoso: isDefectuosoValue,  // Se guarda 0 para conformidad y 1 para no conformidad
      pais: selectedProv,  // Guardar solo el número del país
      unidad: selecteduni[0],  // Aquí se guarda la unidad
      nombreUnidad: selecteduni[0],  // Aquí se guarda el nombre de la unidad
      cantidad: this.cantidad,
      orden: this.orden,
      observacionesProducto: this.observacionesProducto,
      peso: this.peso,
      usuario: this.usuario,  // Se agrega el usuario desde el localStorage
      referencia: this.referencia  // Se agrega la referencia desde el localStorage
    };
  
    console.log('Valor de isDefectuoso:', this.isDefectuoso);
    console.log('Datos a enviar:', data);
  
    // Registrar el producto
    this.registroPService.registrar(data).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        this.showSuccessModal = true; // Mostrar modal de éxito
  
        // Si el producto no está clasificado, también registrar en noclasificado
        if (!this.isProductoClasificado) {
          this.agregarNoclasificado();
        }
  
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
    this.router.navigate(['/registro-productos']); // Redirige después de cerrar
  }

  resetForm() {
    this.producto = '';
    this.descripcion = '';
    this.numeroSerie = '';
    this.isDefectuoso = '';
    this.cantidad = '';
    this.orden = '';
    this.observacionesProducto = '';
    this.peso = '';
    this.selectedpais = ''; // Restablecer el campo país
    this.selectedunidad = ''; // Restablecer el campo unidad
    this.usoMercancia = ''; // Restablecer el campo uso de mercancía
    this.estadoMercancia = ''; // Restablecer el campo estado de mercancía
    this.presentacionComposicion = ''; // Restablecer el campo presentación y composició
    this.marca = ''; // Restablecer el campo marca
    this.modelo = ''; // Restablecer el campo modelo
    this.validacionProductoMensaje = ''; // Restablecer el mensaje de validación
    this.mostrarCamposAdicionales = false; // Restablecer la visibilidad de los campos adicionales
  }

  loadData() {
    this.isloading = true;
    setTimeout(() => {
      this.isloading = false;
    }, 3000); // Simula 2 segundos de carga
  }
  cancelar() {
    this.router.navigate(['/productos']); // Redirige a la lista de productos si se cancela
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
  mostrarTooltip(): void {
    console.log('Tooltip mostrado: El orden es el número de cómo está capturado el producto en la factura');
  }
}
