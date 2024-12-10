import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConfigurationComponent} from './configuration/configuration.component';
import {
    ConfigAbsencesformComponent
} from './configuration/configModif/config-absencesform/config-absencesform.component';

const routes: Routes = [
    { path: '', component: ConfigurationComponent},
    { path: 'modifabsences', component: ConfigAbsencesformComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
