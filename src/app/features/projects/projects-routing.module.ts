import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from './components/Projects-home/projects.component';
import {projectResolverResolver} from './resolvers/project-resolver.resolver';
import {ProjectGraphComponent} from './components/voir-graphique/voir-graphique.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import {EncodageCoutsProjetComponent} from './components/encodage-couts-projet/encodage-couts-projet.component';
import {CalendarComponent} from '../time-tracking/components/calendar/calendar.component';
import {unauthenticatedGuard} from '../../shared/guards/authenticated.guard';
import {EncodageRentreeProjetComponent} from './components/encodage-rentree-projet/encodage-rentree-projet.component';
import {ProjectrapportComponent} from './components/project-rapport/projectrapport.component';
import {ProjectCreationComponent} from './components/project-creation/project-creation.component';

const routes: Routes = [
    { path: '',
        component: ProjectsComponent,
    resolve: {
        projects : projectResolverResolver,
        },
    },
    {
        path: 'encodagecouts/:id',
        component: EncodageCoutsProjetComponent,
    },
    {
        path: 'encodagerentrees/:id',
        component: EncodageRentreeProjetComponent,
    },
    {
        path: 'details/:id', // Route pour voir les détails d'un projet spécifique
        component: ProjectDetailsComponent,
    },
    {path:'graphique/:id', component : ProjectGraphComponent,}, //Route pour voir le graphique
    {path:'rapport',component : ProjectrapportComponent},//Route pour crée le rapport
    {
        path: 'create-project',
        component: ProjectCreationComponent,
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
