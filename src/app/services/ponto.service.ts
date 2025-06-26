export interface PontoColeta {
  id: string;
  nome: string;
  materiais: string[];
  latitude: number;
  longitude: number;
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PontoService {

  private readonly storageKey = 'pontos-coleta';

  constructor() { }

  getAll(): PontoColeta[] {
    const pontos = localStorage.getItem(this.storageKey);
    return pontos ? JSON.parse(pontos) : [];
  }

  save(ponto: Omit<PontoColeta, 'id'>): PontoColeta {
    const pontos = this.getAll();
    const novoPonto = { ...ponto, id: crypto.randomUUID() };
    pontos.push(novoPonto);
    localStorage.setItem(this.storageKey, JSON.stringify(pontos));
    return novoPonto;
  }

  update(pontoAtualizado: PontoColeta): PontoColeta {
    let pontos = this.getAll();
    pontos = pontos.map(p => p.id === pontoAtualizado.id ? pontoAtualizado : p);
    localStorage.setItem(this.storageKey, JSON.stringify(pontos));
    return pontoAtualizado;
  }

  delete(id: string): void {
    let pontos = this.getAll();
    pontos = pontos.filter(p => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(pontos));
  }
}
