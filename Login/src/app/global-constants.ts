// src/app/services/global-variables.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
  private rfcUsuario: string = '';
  private oficina: string = '';

  constructor() {}

  setRfcUsuario(rfc: string): void {
    this.rfcUsuario = rfc;
  }

  getRfcUsuario(): string {
    return this.rfcUsuario;
  }

  setOficina(oficina: string): void {
    this.oficina = oficina;
  }

  getOficina(): string {
    return this.oficina;
  }
}
