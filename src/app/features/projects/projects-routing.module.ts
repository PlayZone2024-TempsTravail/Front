import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from './components/Projects-home/projects.component';
import {projectResolverResolver} from './resolvers/project-resolver.resolver';
import {ProjectGraphComponent} from './components/voir-graphique/voir-graphique.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import {EncodageCoutsProjetComponent} from './components/encodage-couts-projet/encodage-couts-projet.component';
import { ProjectCreationComponent } from './components/project-creation/project-creation.component';
import {CalendarComponent} from '../time-tracking/components/calendar/calendar.component';
import {unauthenticatedGuard} from '../../shared/guards/authenticated.guard';
import {ProjectModificationComponent} from './components/project-modification/project-modification.component';

const routes: Routes = [
    { path: '',
        component: ProjectsComponent,
    resolve: {
        projects : projectResolverResolver,
        },
    },
    {
        path: 'encodage-couts-projet/:id',
        component: EncodageCoutsProjetComponent,
    },
    {
        path: 'details/:id', // Route pour voir les détails d'un projet spécifique
        component: ProjectDetailsComponent,
    },
    {
        path: 'create-project',
        component: ProjectCreationComponent,
    },
    {
        path: 'modifier-projet/:id',
        component: ProjectModificationComponent,
    },
    {
        path:'graphique/:id',
        component : ProjectGraphComponent,
    } //Route pour voir le graphique
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
