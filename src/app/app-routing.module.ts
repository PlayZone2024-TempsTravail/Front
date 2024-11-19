import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './features/home/home.component';

const routes: Routes = [
    { path: '', component : HomeComponent },
    { path : 'accueil', redirectTo : '/'},
    { path : 'gestion',
        loadChildren : () =>
            import('./features/management/management.module').then(m => m.ManagementModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}

