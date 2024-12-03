import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BackDirective } from './directives/back.directive';

@NgModule({
  declarations: [
    BackDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        BackDirective,
    ]
})
export class SharedModule { }
