import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import {TableModule} from 'primeng/table';
import {ChipModule} from 'primeng/chip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';


@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent,
  ],
    imports: [
        CommonModule,
        UsersRoutingModule,
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
        UserListComponent,
        UserFormComponent,
    ],
})
export class UsersModule { }
