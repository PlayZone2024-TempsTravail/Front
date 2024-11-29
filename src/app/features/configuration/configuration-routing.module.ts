import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from '../projects/components/projects.component';
import {ConfigurationComponent} from './configuration/configuration.component';

const routes: Routes = [
    { path: '', component: ConfigurationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
