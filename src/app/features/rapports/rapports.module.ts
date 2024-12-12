import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RapportsComponent} from './rapports.component';
import { RapportsRoutingModule } from './rapports-routing.module';
import {CalendarModule} from 'primeng/calendar';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
      RapportsComponent,
  ],
    imports: [
        CommonModule,
        RapportsRoutingModule,
        CalendarModule,
        ReactiveFormsModule

    ],
    exports: [
        RapportsComponent,
    ],
})
export class RapportsModule { }
