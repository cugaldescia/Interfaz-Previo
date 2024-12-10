import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReferenciasService {
  constructor(private http: HttpClient) {}

  getReferencias(rfc: string, oficina: string): Observable<any> {
    const url = `http://192.1.171.49:8096/referencias/${rfc}/${oficina}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<any[]>(url, { headers }).pipe(
      map(response => {
        if (!response) {
          throw new Error('La respuesta del servidor es nula o indefinida.');
        }

        if (Array.isArray(response) && response.length > 0) {
          const item = response[0]; // Tomamos el primer elemento para almacenar en localStorage
          
          // Validar campos antes de almacenarlos
          if (item.cliente && item.referencia && item.nombre && item.rfc) {
            localStorage.setItem('cliente', item.cliente);
            localStorage.setItem('referencia', item.referencia);
            localStorage.setItem('nombre', item.nombre);
            localStorage.setItem('rfc', item.rfc);
          } else {
            console.warn('Algunos campos están indefinidos en el elemento', item);
          }

          console.log('Valores almacenados en localStorage:', {
            cliente: localStorage.getItem('cliente'),
            referencia: localStorage.getItem('referencia'),
            nombre: localStorage.getItem('nombre'),
            rfc: localStorage.getItem('rfc')
          });

          return response; // Retornar el arreglo completo
        } else {
          throw new Error('La respuesta no contiene referencias o está vacía.');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener las referencias:', error.message || error);
        return throwError(() => new Error('No se pudieron obtener las referencias. Intente nuevamente.'));
      })
    );
  }
}