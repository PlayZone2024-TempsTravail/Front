import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './components/Projects-home/projects.component';
import {TableModule} from 'primeng/table';
import {ChipModule} from 'primeng/chip';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import {UserListComponent} from '../users/components/user-list/user-list.component';
import {UserFormComponent} from '../users/components/user-form/user-form.component';
import {FormsModule} from '@angular/forms';
import {ProjectGraphComponent} from './components/voir-graphique/voir-graphique.component';
import {ChartModule} from 'primeng/chart';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import {SharedModule} from '../../shared/shared.module';



@NgModule({
  declarations: [
      ProjectsComponent,
      ProjectGraphComponent,
      ProjectDetailsComponent,
  ],
    imports: [
        CommonModule,
        ProjectsRoutingModule,


        // PrimeNG
        TableModule,
        ChipModule,
        ButtonModule,
        InputTextModule,
        CardModule,
        ToastModule,
        DialogModule,
        DropdownModule,
        RadioButtonModule,
        FormsModule,
        ChartModule,
        SharedModule,
    ],
    exports: [
        ProjectsComponent,
        ProjectDetailsComponent,
        ProjectGraphComponent
    ],
})
export class ProjectsModule { }
