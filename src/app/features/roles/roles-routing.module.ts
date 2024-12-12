import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShowPermissionsComponent} from './components/show-permissions/show-permissions.component';
import {rolesResolver} from './resolvers/roles.resolver';

const routes: Routes = [
    {path: '', redirectTo: 'showpermission', pathMatch: 'full'},
    {path: 'showpermission', component: ShowPermissionsComponent, resolve: {rolesData: rolesResolver}},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RolesRoutingModule {
}
