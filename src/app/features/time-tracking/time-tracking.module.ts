import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeTrackingRoutingModule } from './time-tracking-routing.module';
import { CalendarComponent } from './components/calendar/calendar.component';


@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    TimeTrackingRoutingModule
  ]
})
export class TimeTrackingModule { }

