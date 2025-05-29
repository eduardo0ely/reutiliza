import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  erro: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.email === 'teste@teste.com' && this.senha === '123456') {
      // Simula um login válido e redireciona para a tela de materiais
      this.router.navigate(['/materiais']);
    } else {
      this.erro = 'Email ou senha inválidos.';
    }
  }
}
