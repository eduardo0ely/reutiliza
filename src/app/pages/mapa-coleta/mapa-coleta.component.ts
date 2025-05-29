import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mapa-coleta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-coleta.component.html',
  styleUrls: ['./mapa-coleta.component.css']
})
export class MapaColetaComponent implements AfterViewInit {
  materialSelecionado: any;
  map!: L.Map;

  ngAfterViewInit(): void {
    this.materialSelecionado = JSON.parse(localStorage.getItem('materialSelecionado') || '{}');

    const pontoColeta = L.latLng(-27.0989, -52.6154);
    this.map = L.map('map').setView(pontoColeta, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const greenIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
      className: 'animated-marker'
    });

    L.marker(pontoColeta, { icon: greenIcon })
      .addTo(this.map)
      .bindPopup(`
        <b>Ponto de Coleta</b><br>
        Material: ${this.materialSelecionado.nome || 'Desconhecido'}
      `);

    this.map.locate({ setView: true, maxZoom: 16 });

    this.map.on('locationfound', (e: any) => {
      const userLatLng = e.latlng;

      L.marker(userLatLng)
        .addTo(this.map)
        .bindPopup('Você está aqui')
        .openPopup();

      (L as any).Routing.control({
        waypoints: [userLatLng, pontoColeta],
        routeWhileDragging: false,
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        createMarker: () => null
      }).addTo(this.map);

      setTimeout(() => {
        const routingContainers = document.querySelectorAll('.leaflet-routing-container');
        routingContainers.forEach(container => {
          (container as HTMLElement).style.display = 'none';
        });
      }, 500);
    });

    this.map.on('locationerror', () => {
      alert('Não foi possível obter sua localização.');
    });
  }

  centralizarNoUsuario() {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = L.latLng(position.coords.latitude, position.coords.longitude);
        this.map.setView(coords, 16);
        L.marker(coords).addTo(this.map).bindPopup('Você está aqui').openPopup();
      },
      () => {
        alert('Não foi possível obter sua localização.');
      }
    );
  }

  centralizarNoPontoColeta() {
    const pontoColeta = L.latLng(-27.0989, -52.6154);
    this.map.setView(pontoColeta, 16);
    L.popup()
      .setLatLng(pontoColeta)
      .setContent(`<b>Ponto de Coleta</b><br>Material: ${this.materialSelecionado.nome || 'Desconhecido'}`)
      .openOn(this.map);
  }
}
