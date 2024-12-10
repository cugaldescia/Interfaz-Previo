import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class NoclasificadoService {
  private apiUrlPost = 'http://192.1.171.49:8096/clasificacion';

  constructor(private http: HttpClient) {}

  registrarClasificacion(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      referencia: data.referencia?.trim() || '',
      claveCliente: data.claveCliente?.trim() || '',
      claveProveedor: data.claveProveedor?.trim() || '',
      producto: data.producto?.trim() || '',
      descripcion: data.descripcion?.trim() || '',
      usoMercancia: data.usoMercancia?.trim() || '',
      estadoMercancia: data.estadoMercancia?.trim() || '',
      clavePais: data.clavePais?.trim() || '',
      claveUnidadMedida: data.claveUnidadMedida?.trim() || '',
      marca: data.marca?.trim() || '',
      modelo: data.modelo?.trim() || '',
      presentacionComposicion: data.presentacionComposicion?.trim() || '',
      oficina: data.oficina?.trim() || '',
      usuario: data.usuario?.trim() || ''
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