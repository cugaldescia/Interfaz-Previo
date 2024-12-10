import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private apiUrl = 'http://192.1.171.49:8096/proveedor/';

  constructor(private http: HttpClient) {}

  getProveedor(rfc1: string, oficina: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrl}${rfc1}/${oficina}`;

    return this.http.get<any[]>(url, { headers }).pipe(
      map(response => {
        console.log("API Response:", response);  // Muestra toda la respuesta en la consola
        
        if (Array.isArray(response) && response.length > 0) {
          response.forEach((item, index) => {
            const { nombre, clave, identificador } = item;
            console.log(`Proveedor ${index + 1}:`, { nombre, clave, identificador });  // Muestra cada proveedor en la consola

            // Almacena los datos del primer proveedor
            if (index === 0) {
              localStorage.setItem('nombre', nombre);
              localStorage.setItem('identificador', identificador.toString());
              localStorage.setItem('clave', clave);
            }
          });

          return response;
        } else {
          throw new Error(`Datos incompletos en la respuesta. Estructura recibida: ${JSON.stringify(response)}`);
        }
      })
    );
  }
}