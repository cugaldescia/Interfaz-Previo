import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {
  private apiUrl = 'http://192.1.171.49:8096/unidadmedida/';

  constructor(private http: HttpClient) {}

  getUnidad(oficina: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrl}${oficina}`;

    return this.http.get<any[]>(url, { headers }).pipe(
      // Si la respuesta es exitosa, almacenamos los primeros datos en el localStorage
      catchError(error => {
        console.error('Error al obtener unidades:', error);
        throw error;
      })
    );
  }
}
