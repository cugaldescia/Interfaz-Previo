import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuarios } from '../../services/usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private usuarios: Usuarios,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Por favor, rellena todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    console.log('Enviando datos de login:', { username: this.username, password: this.password });

    this.usuarios.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          console.log('Respuesta de login exitosa:', response);
          const userData = response.usuario;
          localStorage.setItem('userData', JSON.stringify(userData));
          this.router.navigate(['/asignacion-referencias']);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Usuario o contraseña incorrectos';
          console.error('Error de login:', error);
        },
        complete: () => {
          this.loading = false;
          console.log('Proceso de login completado');
        }
      });
  }
}
