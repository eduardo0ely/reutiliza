import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css']
})
export class MaterialListComponent {
  materiais = [
    { nome: 'Papel' },
    { nome: 'Plástico' },
    { nome: 'Vidro' },
    { nome: 'Metal' },
    { nome: 'Eletrônicos' }
  ];

  constructor(private router: Router) {}

  selecionarMaterial(material: any) {
    // Salva o material escolhido no localStorage (forma simples de passar dados)
    localStorage.setItem('materialSelecionado', JSON.stringify(material));
    this.router.navigate(['/rota']);
  }

  usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo seu navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Aqui você pode armazenar a localização e redirecionar ou fazer outra coisa
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        localStorage.setItem('usuarioLocalizacao', JSON.stringify(coords));
        alert(`Localização atual capturada: lat ${coords.lat}, lng ${coords.lng}`);
        // Por exemplo, redirecionar para a rota do mapa
        this.router.navigate(['/rota']);
      },
      (error) => {
        alert('Não foi possível obter sua localização.');
      }
    );
  }

  mostrarPontoColeta() {
    // Apenas redireciona para a tela de rota, onde você mostra o ponto de coleta
    this.router.navigate(['/rota']);
  }
}
