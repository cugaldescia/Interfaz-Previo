import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditarProductoService {
  private apiUrlPatch = 'http://192.1.171.49:8096/referencias/facturas/producto';

  constructor(private http: HttpClient) {}

  patchProducto(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      idProducto: data.productoId,
      facturaId: data.facturaId,
      producto: data.producto,
      descripcion: data.descripcion,
      numeroSerie: data.numeroSerie,
      estatus: data.isDefectuoso,
      peso: data.peso,
      pais: data.pais,
      unidad: data.unidad,
      cantidad: data.cantidad,
      orden: data.orden,
      observacionesProducto: data.observacionesProducto
    };

    return this.http.patch<any>(this.apiUrlPatch, body, { headers }).pipe(
      map(response => {
        console.log('Respuesta del servidor PATCH:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error al enviar datos PATCH:', error);
        const errorMessage = error.error?.message || error.message || 'Error desconocido';
        return throwError(() => new Error(`Error en el registro: ${errorMessage}`));
      })
    );
  }
}