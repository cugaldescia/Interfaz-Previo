import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FotosService {

  private apiUrl = 'http://192.1.171.49:8096/fotos/referenciaparte/';

  constructor(private http: HttpClient) {}

  getFotos(referencia: string, producto:string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrl}${referencia}/${producto}`;

    return this.http.get<any[]>(url, { headers }).pipe(
      // Si la respuesta es exitosa, almacenamos los primeros datos en el localStorage
      catchError(error => {
        console.error('Error al obtener las imagenes:', error);
        throw error;
      })
    );
  }
}
