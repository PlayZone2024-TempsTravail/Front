import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeTrackingRoutingModule } from './time-tracking-routing.module';
import { TimeTrackingComponent } from './components/time-tracking.component';


@NgModule({
  declarations: [
    TimeTrackingComponent
  ],
  imports: [
    CommonModule,
    TimeTrackingRoutingModule
  ]
})
export class TimeTrackingModule { }
