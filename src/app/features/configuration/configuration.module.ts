import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import {Button} from "primeng/button";
import {ChipModule} from 'primeng/chip';
import {PrimeTemplate} from 'primeng/api';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TableModule} from 'primeng/table';
import {FloatLabelModule} from 'primeng/floatlabel';
import {SharedModule} from '../../shared/shared.module';
import {DividerModule} from 'primeng/divider';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from "primeng/toast";
import { MessageService } from 'primeng/api';
import { ConfigAbsencesformComponent } from './configuration/configModif/config-absencesform/config-absencesform.component';


@NgModule({
  declarations: [
    ConfigurationComponent,
    ConfigAbsencesformComponent
  ],
    imports: [
        CommonModule,
        ConfigurationRoutingModule,
        Button,
        ChipModule,
        PrimeTemplate,
        RadioButtonModule,
        TableModule,
        FloatLabelModule,
        SharedModule,
        DividerModule,
        InputNumberModule,
        ToastModule
    ],
    providers: [MessageService]
})
export class ConfigurationModule { }
