import { TimeTrackingRoutingModule } from './time-tracking-routing.module';
import { FormsModule } from '@angular/forms'; 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../time-tracking/components/calendar/calendar.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppointmentDialogComponent } from './components/appointment-dialog/appointment-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';

const routes: Routes = [{ path: '', component: CalendarComponent }];

@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIconModule,
    DragDropModule,
    AppointmentDialogComponent,
    MatNativeDateModule,
    RouterModule.forChild(routes),

  ]
})
export class TimeTrackingModule { }

