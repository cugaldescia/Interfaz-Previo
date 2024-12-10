import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  constructor(private http: HttpClient) {}

  // Método para obtener productos, ya proporcionado
  getProductos(factura: string): Observable<any> {
    const url = `http://192.1.171.49:8096/referencias/facturas/productos/${factura}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        console.log("API Response:", response);
        if (response && response.productos && Array.isArray(response.productos)) {
          const productos = response.productos;

          if (productos.length > 0) {
            const item = productos[0];
            const { unidad, pais, cantidad, orden, numeroSerie, descripcion, producto, estatus, productoId, observaciones, peso } = item;

            localStorage.setItem('unidad', unidad);
            localStorage.setItem('pais', pais);
            localStorage.setItem('cantidad', cantidad.toString());
            localStorage.setItem('orden', orden);
            localStorage.setItem('numeroSerie', numeroSerie);
            localStorage.setItem('descripcion', descripcion);
            localStorage.setItem('producto', producto);
            localStorage.setItem('estatus', estatus.toString());
            localStorage.setItem('productoId', productoId.toString());
            localStorage.setItem('observaciones', observaciones);
            localStorage.setItem('peso', peso.toString());
          }
          return productos;
        } else {
          throw new Error(`Datos incompletos en la respuesta. Estructura recibida: ${JSON.stringify(response)}`);
        }
      }),
      catchError(error => {
        console.error('Error en la solicitud:', error);
        return throwError(error);
      })
    );
  }
}