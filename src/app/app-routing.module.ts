import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './features/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { authenticatedGuard, unauthenticatedGuard } from './shared/guards/authenticated.guard';
import { CalendarComponent } from './features/time-tracking/components/calendar/calendar.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent, canActivate: [authenticatedGuard] },
    { path: 'pointage', loadChildren: () => import('./features/time-tracking/time-tracking.module').then(m => m.TimeTrackingModule)},
    { path: 'pointage/calendrier', component: CalendarComponent, canActivate: [unauthenticatedGuard]},
    
    { path: '**', redirectTo: '' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}