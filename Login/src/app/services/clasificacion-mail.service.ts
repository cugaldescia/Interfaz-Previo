import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionMailService {

  private apiUrl = 'http://192.1.171.49:8096/clasificacion/mail';

  constructor(private http: HttpClient) {}

  mandarMail(entry: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, entry, { headers, responseType: 'text' });
  }
}