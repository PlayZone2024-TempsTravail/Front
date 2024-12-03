import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from './components/Projects-home/projects.component';
import {projectResolverResolver} from './resolvers/project-resolver.resolver';
import {EncodageCoutsProjetComponent} from './components/encodage-couts-projet/encodage-couts-projet.component';

const routes: Routes = [
    { path: '',
        component: ProjectsComponent,
    resolve: {
        projects : projectResolverResolver,
        },
    },
    {
        path: 'encodage-couts-projet',
        component: EncodageCoutsProjetComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
