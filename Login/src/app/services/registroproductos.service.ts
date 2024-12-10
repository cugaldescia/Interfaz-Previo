import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistroproductosService {
  [x: string]: any;
  private apiUrlPost = 'http://192.1.171.49:8096/referencias/facturas/productos/';

  constructor(private http: HttpClient) {}

  registrar(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      facturaId: data.facturaId?.trim() || '',
      producto: data.producto?.trim() || '',
      descripcion: data.descripcion?.trim() || '',
      numeroSerie: data.numeroSerie?.trim() || '',
      isDefectuoso: data.isDefectuoso !== undefined ? data.isDefectuoso : '',
      pais: data.pais?.trim() || '',
      unidad: data.unidad?.trim() || '',
      cantidad: data.cantidad?.trim() || '',
      orden: data.orden?.trim() || '',
      observacionesProducto: data.observacionesProducto?.trim() || '',
      peso: data.peso?.trim() || ''
    };

    console.log('Cuerpo de la solicitud POST:', body);

    return this.http.post<any>(this.apiUrlPost, body, { headers }).pipe(
      map((response) => {
        console.log('Respuesta del servidor POST:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Error al enviar datos POST:', error);
        const errorMessage = error.error?.message || error.message || 'Error desconocido';
        return throwError(() => new Error(`Error en el registro: ${errorMessage}`));
      })
    );
  }

  
}