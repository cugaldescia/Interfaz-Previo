import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://192.1.171.49:8096/usuarios/login';

  constructor(private http: HttpClient) {}

  login(usuario: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ usuario, password });

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        if (response && response.usuario) {
          // Almacenar los datos del usuario en localStorage
          const { usuario: usuario, nombreu, rfc, oficina } = response.usuario;
          localStorage.setItem('usuario', usuario);  // Almacenar el ID del usuario
          localStorage.setItem('nombre', nombreu);      // Almacenar el nombre del usuario
          localStorage.setItem('rfc', rfc);            // Almacenar el RFC del usuario
          localStorage.setItem('oficina', oficina);    // Almacenar la oficina del usuario

          // Retornar el usuario completo
          return response.usuario;
        }
        throw new Error('Usuario o contraseña incorrectos');
      })
    );
  }
}
