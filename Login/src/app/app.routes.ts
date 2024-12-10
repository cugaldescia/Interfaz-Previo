import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AsignacionReferenciasComponent } from './pages/asignacion-referencias/asignacion-referencias.component';
import { FacturasComponent } from './pages/facturas/facturas.component';
import { RegistroFacturasComponent } from './pages/registro-facturas/registro-facturas.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { RegistroProductosComponent } from './pages/registro-productos/registro-productos.component';
import { EditarProductosComponent } from './pages/editar-productos/editar-productos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'asignacion-referencias', component: AsignacionReferenciasComponent },
  { path: 'facturas', component: FacturasComponent },
  { path: 'registro-facturas', component: RegistroFacturasComponent},
  { path: 'registro-productos', component: RegistroProductosComponent},
  { path: 'productos', component: ProductosComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'editar-productos/:descripcion', component: EditarProductosComponent }
   ,];