// registro-fp.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RegistroFPService {
  private apiUrl = 'http://192.1.171.49:8096/referencias/';
  constructor(private http: HttpClient) {}

  registrar(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      referencia: data.referencia || '',
      cliente: data.cliente || '',
      nombreCliente: data.nombreCliente || '',
      proveedor: data.proveedor || '',
      nombreProveedor: data.nombreProveedor || '',
      taxId: data.taxId || '',
      factura: data.factura || '',
      observacionesPrevio: data.observacionesPrevio || ''
    };
  
    console.log('Cuerpo de la solicitud:', body);
  
    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        console.log('Respuesta del servidor:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Error al enviar datos:', error);
        return throwError(error);
      })
    );
  }
}  