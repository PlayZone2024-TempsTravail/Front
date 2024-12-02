import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from './components/Projects-home/projects.component';
import {projectResolverResolver} from './resolvers/project-resolver.resolver';
import { ProjectCreationComponent } from './components/project-creation/project-creation.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent,
        resolve: {
            projects: projectResolverResolver,
        },
    },
    {
        path: 'create-project',
        component: ProjectCreationComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
