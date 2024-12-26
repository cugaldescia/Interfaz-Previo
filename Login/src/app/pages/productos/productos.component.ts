import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FotosService } from '../../services/fotos.service';
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  factura: string | null = '';
  dataSource = new MatTableDataSource<any>(); 
  productoSeleccionado: any | null = null;
  showModal = false; 
  usuario: string = '';
  oficina: string = '';
  isLoading = false;
  nombreusuario: string | null = '';
  showImageModal = false;
  imagenes: string[] = [];
  currentImageIndex = 0;


  constructor(
    private dialog: MatDialog,
    private productosService: ProductosService,
    private fotosService: FotosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.factura = localStorage.getItem('factura') || '';
    this.usuario = localStorage.getItem('usuario') || '';
    this.oficina = localStorage.getItem('oficina') || '';
    this.nombreusuario = localStorage.getItem('nombreUsuario') || '';

    if (!this.factura) {
      console.error('Factura no encontrada en el localStorage');
      return;
    }

    console.log('factura:', this.factura);
    this.obtenerProductos(this.factura);
    this.loadData();

  }

  obtenerProductos(factura: string): void {
    this.productosService.getProductos(factura).subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.dataSource.data = response.length > 0 ? response.sort((a, b) => a.orden - b.orden) : [];
          console.log('Productos cargados:', this.dataSource.data);
        } else {
          console.warn('La respuesta de la API no es válida:', response);
          this.dataSource.data = [];
        }
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }

  navigateToRegistroProducto(): void {
    this.router.navigate(['/registro-productos']);
  }
  closeModal() {
    this.showModal = false;
    this.productoSeleccionado = null;
  }
  editarProducto() {
    this.router.navigate(['/editar-productos', this.productoSeleccionado.descripcion]); // Redirige a la página de editar producto
    this.closeModal(); // Cierra el modal
  }

  onReferenciaClick(productoData: any): void {
    if (!productoData?.orden || !productoData?.descripcion) {
      console.warn('Datos incompletos para la referencia seleccionada:', productoData);
      return;
    }

    this.productoSeleccionado = productoData;
    this.showModal = true;
    console.log('Producto seleccionado:', productoData);


  // Método para cerrar el modal


    localStorage.setItem('unidad', productoData.unidad);
    localStorage.setItem('pais', productoData.pais);
    localStorage.setItem('cantidad', productoData.cantidad.toString());
    localStorage.setItem('orden', productoData.orden);
    localStorage.setItem('numeroSerie', productoData.numeroSerie);
    localStorage.setItem('descripcion', productoData.descripcion);
    localStorage.setItem('producto', productoData.producto);
    localStorage.setItem('estatus', productoData.estatus.toString());
    localStorage.setItem('productoId', productoData.productoId.toString());
    localStorage.setItem('observaciones', productoData.observaciones);
    localStorage.setItem('peso', productoData.peso.toString());
  }
  loadData(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 3000); 
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
  verFotos(productoData: any): void {
    const referencia = localStorage.getItem('referencia');
    if (!referencia) {
      console.error('Referencia no encontrada en el localStorage');
      return;
    }

    this.fotosService.getFotos(referencia, productoData.producto).subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.imagenes = response.map(foto => `data:image/jpeg;base64,${foto.imagen.data}`);
          this.currentImageIndex = 0;
          this.showImageModal = true;
        } else {
          console.warn('La respuesta de la API no es válida:', response);
        }
      },
      error: (error) => {
        console.error('Error al obtener las imágenes:', error);
      }
    });
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.imagenes = [];
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage(): void {
    if (this.currentImageIndex < this.imagenes.length - 1) {
      this.currentImageIndex++;
    }
  }
  
}
