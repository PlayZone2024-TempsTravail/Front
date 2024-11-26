import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/pointage', pathMatch: 'full' },
<<<<<<< Updated upstream
    { path: 'pointage', loadChildren: () => import('./features/time-tracking/time-tracking.module').then(m => m.TimeTrackingModule) },
    { path: 'projet', loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule) },
    { path: 'equipe', loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule) },
    { path: 'configuration', loadChildren: () => import('./features/configuration/configuration.module').then(m => m.ConfigurationModule) },
=======
    { path: 'pointage', loadChildren: () => import('./features/time-tracking/time-tracking.module').then(m => m.TimeTrackingModule), canActivate: [unauthenticatedGuard]},
    { path: 'projet', loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule), canActivate: [unauthenticatedGuard] },
    { path: 'equipe', loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule), canActivate: [unauthenticatedGuard] },
    { path: 'configuration', loadChildren: () => import('./features/configuration/configuration.module').then(m => m.ConfigurationModule), canActivate: [unauthenticatedGuard] },
    { path: 'login', component: LoginComponent, canActivate: [authenticatedGuard] },
>>>>>>> Stashed changes
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
