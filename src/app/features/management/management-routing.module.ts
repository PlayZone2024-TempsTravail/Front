import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from './users/components/user-list/user-list.component';

const routes: Routes = [
    {
        path: 'utilisateurs',
        loadChildren: () =>
            import('./users/users.module').then((m) => m.UsersModule),
    },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
