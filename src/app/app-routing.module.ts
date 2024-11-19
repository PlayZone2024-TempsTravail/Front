import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './features/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { authenticatedGuard } from './shared/guards/authenticated.guard';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent, canActivate: [authenticatedGuard] },
    { path: 'pointage', loadChildren: () => import('./features/time-tracking/time-tracking.module').then(m => m.TimeTrackingModule)},
    
    { path: '**', redirectTo: '' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
