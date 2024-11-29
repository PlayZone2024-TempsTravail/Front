import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CalendarComponent} from '../time-tracking/components/calendar/calendar.component';
import {unauthenticatedGuard} from '../../shared/guards/authenticated.guard';
import {ProjectsComponent} from './components/projects.component';

const routes: Routes = [
    { path: '', component: ProjectsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
