import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from './components/user-list/user-list.component';
import {userListResolver} from './resolvers/user-list.resolver';

const routes: Routes = [
    { path: '',
        component: UserListComponent,
        resolve : {
        users : userListResolver
        },
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
