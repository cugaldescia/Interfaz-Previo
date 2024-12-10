import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {

  private apiUrl = 'http://192.1.171.49:8096/bitacora/';

  constructor(private http: HttpClient) {}

  guardarBitacora(entry: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, entry, { headers });
  }
}