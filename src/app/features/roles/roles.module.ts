import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RolesRoutingModule} from './roles-routing.module';
import {ShowPermissionsComponent} from './components/show-permissions/show-permissions.component';
import {TableModule} from "primeng/table";
import {CheckboxModule} from 'primeng/checkbox';
import {SharedModule} from "../../shared/shared.module";
import {ButtonDirective} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from "primeng/toast";
import {MessageService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {UsersModule} from '../users/users.module';
import { NewRoleFormComponent } from './components/new-role-form/new-role-form.component';
import {FloatLabelModule} from 'primeng/floatlabel';
import {CalendarModule} from 'primeng/calendar';
import {MultiSelectModule} from 'primeng/multiselect';
import { RemoveRoleFormComponent } from './components/remove-role-form/remove-role-form.component';
import { EditRoleFormComponent } from './components/edit-role-form/edit-role-form.component';


@NgModule({
    declarations: [
        ShowPermissionsComponent,
        NewRoleFormComponent,
        RemoveRoleFormComponent,
        EditRoleFormComponent
    ],
    imports: [
        CommonModule,
        RolesRoutingModule,
        TableModule,
        CheckboxModule,
        SharedModule,
        ButtonDirective,
        DropdownModule,
        InputTextModule,
        ToastModule,
        DialogModule,
        UsersModule,
        FloatLabelModule,
        CalendarModule,
        MultiSelectModule
    ],
    providers: [
        MessageService
    ]
})
export class RolesModule {
}
