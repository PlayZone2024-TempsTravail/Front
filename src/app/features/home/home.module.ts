import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';


@NgModule({
  declarations: [
      HomeComponent,

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ScrollPanelModule,
  ]
})
export class HomeModule { }
