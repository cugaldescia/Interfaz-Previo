import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidacionService {

  private apiUrl = 'http://192.1.171.49:8096/clasificacion';

  constructor(private http: HttpClient) { }

  validarProducto(producto: string): Observable<any> {
    const url = `${this.apiUrl}/${producto}`;
    return this.http.get<any>(url);
  }
}