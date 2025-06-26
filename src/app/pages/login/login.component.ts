import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


// Função para validar se as senhas são iguais (só para o modo de cadastro)
export function senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
  const senha = control.get('senha');
  const confirmarSenha = control.get('confirmarSenha');

  // Se o controle de confirmar senha não existir, não fazemos nada
  if (!confirmarSenha) {
    return null;
  }

  return senha && confirmarSenha && senha.value !== confirmarSenha.value ? { senhasNaoConferem: true } : null;
};


@Component({
  selector: 'app-login',
  standalone: true, // Garanta que esta linha exista ou adicione-a
  imports: [CommonModule, ReactiveFormsModule], // <-- ESTA É A LINHA MÁGICA
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoginMode = true; // Começamos no modo de Login
  mensagemErro = '';
  mensagemSucesso = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Se o usuário já está logado, redireciona para o mapa
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/mapa']);
    }
    this.iniciarFormulario();
  }

  iniciarFormulario(): void {
    if (this.isLoginMode) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required]]
      });
    } else {
      // No modo de cadastro, adicionamos a confirmação de senha
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', [Validators.required]]
      }, { validators: senhasIguaisValidator }); // Adicionamos o validador customizado
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    this.iniciarFormulario(); // Reinicia o formulário com os validadores corretos
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.mensagemErro = 'Por favor, preencha os campos corretamente.';
      return;
    }

    this.mensagemErro = '';
    this.mensagemSucesso = '';

    const { email, senha } = this.loginForm.value;

    if (this.isLoginMode) {
      // Lógica de LOGIN
      const resultado = this.userService.login(email, senha);
      if (resultado.success) {
        this.router.navigate(['/rota']); // Redireciona para o mapa após login
      } else {
        this.mensagemErro = resultado.message;
      }
    } else {
      // Lógica de CADASTRO
      const resultado = this.userService.register(email, senha);
      if (resultado.success) {
        this.mensagemSucesso = resultado.message + ' Por favor, faça o login.';
        this.toggleMode(); // Volta para a tela de login após cadastro
      } else {
        this.mensagemErro = resultado.message;
      }
    }
  }
}
