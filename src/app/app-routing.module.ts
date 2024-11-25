import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/pointage', pathMatch: 'full' },
    { path: 'pointage', loadChildren: () => import('./features/time-tracking/time-tracking.module').then(m => m.TimeTrackingModule) },
    { path: 'projet', loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule) },
    { path: 'equipe', loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule) },
    { path: 'configuration', loadChildren: () => import('./features/configuration/configuration.module').then(m => m.ConfigurationModule) },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
