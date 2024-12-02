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
import { ProjectCreationComponent } from './components/project-creation/project-creation.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectCreationComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
      FormsModule,
      ReactiveFormsModule,



      // PrimeNG
      TableModule,
      ChipModule,
      ButtonModule,
      InputTextModule,
      CardModule,
      ToastModule,
      DialogModule,
      DropdownModule,
  ],
    exports: [
        ProjectsComponent,
    ],
})
export class ProjectsModule { }
