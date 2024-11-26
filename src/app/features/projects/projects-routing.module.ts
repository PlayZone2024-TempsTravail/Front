import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from '../users/components/user-list/user-list.component';
import {ProjectsComponent} from './components/projects.component';

const routes: Routes = [
    { path: '', component: ProjectsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
