import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConformidadService {
  private apiUrl = 'http://192.1.171.49:8096/bitacora'; // URL de la API

  constructor(private http: HttpClient) {}

  // Método para registrar la conformidad
  Conformidad(idBitacora: string, referencia: string, conformidad: string, observaciones: string, usuario: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Crear el cuerpo de la solicitud en formato JSON
    const body = {
      idBitacora,      // idBitacora en lugar de facturaId
      referencia,
      conformidad,
      observaciones,
      usuario
    };

    // Realiza la solicitud POST y maneja la respuesta
    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        // Comprobar que la respuesta contiene los datos esperados
        if (response && response.bitacora) {
          // Retornar la bitacora completa si todo está bien
          return response.bitacora;
        }
        // Si la respuesta no contiene una bitacora, lanzar un error o manejarlo de otra forma
        throw new Error('Respuesta inesperada del servidor');
      })
    );
  }
}
