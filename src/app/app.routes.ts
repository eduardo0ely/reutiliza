import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MaterialListComponent } from './pages/material-list/material-list.component';
import { MapaColetaComponent } from './pages/mapa-coleta/mapa-coleta.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'materiais', component: MaterialListComponent },
  { path: 'rota', component: MapaColetaComponent }
];
