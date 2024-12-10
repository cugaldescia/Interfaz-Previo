import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  constructor(private http: HttpClient) {}

  getFacturas(referencia: string): Observable<any> {
    const url = `http://192.1.171.49:8096/referencias/facturas/${referencia}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        if (response && response.status === 'OK' && Array.isArray(response.facturas)) {
          const facturas = response.facturas;
    
          if (facturas.length > 0) {
            const item = facturas[0];
    
            if (item.id && item.factura && item.nombreProveedor) {
              localStorage.setItem('id', item.id.toString());
              localStorage.setItem('factura', item.factura);
              localStorage.setItem('nombreProveedor', item.nombreProveedor);
            } else {
              console.warn('Algunos campos están indefinidos en la primera factura:', item);
            }
          }
    
          return facturas;
        } else {
          throw new Error('Datos incompletos o error en la respuesta');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener las facturas:', error);
        throw error;
      })
    );
  }}