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
import {UserListComponent} from '../users/components/user-list/user-list.component';
import {UserFormComponent} from '../users/components/user-form/user-form.component';
import { EncodageCoutsProjetComponent } from './components/encodage-couts-projet/encodage-couts-projet.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';


@NgModule({
  declarations: [
    ProjectsComponent,
    EncodageCoutsProjetComponent
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
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
    ],
    exports: [
        ProjectsComponent,
    ],
})
export class ProjectsModule { }
