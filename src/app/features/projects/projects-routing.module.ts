import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from './components/Projects-home/projects.component';
import {projectResolverResolver} from './resolvers/project-resolver.resolver';
import {ProjectGraphComponent} from './components/voir-graphique/voir-graphique.component';

const routes: Routes = [
    { path: '', component: ProjectsComponent, resolve: {projects : projectResolverResolver,},},
    {path:'graphique/:id', component : ProjectGraphComponent,} //Route pour voir le graphique
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
