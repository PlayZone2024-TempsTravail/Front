import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EncodageCoutsProjetComponent} from './features/projects/components/encodage-couts-projet/encodage-couts-projet.component';
import {authenticatedGuard, unauthenticatedGuard} from './shared/guards/authenticated.guard';
import {LoginComponent} from './features/auth/pages/login/login.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule), canActivate: [unauthenticatedGuard] },
    { path: 'pointage', loadChildren: () => import('./features/time-tracking/time-tracking.module').then(m => m.TimeTrackingModule), canActivate: [unauthenticatedGuard]},
    { path: 'projet', loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule), canActivate: [unauthenticatedGuard] },
    { path: 'equipe', loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule), canActivate: [unauthenticatedGuard] },
    { path: 'configuration', loadChildren: () => import('./features/configuration/configuration.module').then(m => m.ConfigurationModule), canActivate: [unauthenticatedGuard] },
    { path: 'login', component: LoginComponent, canActivate: [authenticatedGuard] },
    { path : 'encodage-des-couts', component : EncodageCoutsProjetComponent }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
