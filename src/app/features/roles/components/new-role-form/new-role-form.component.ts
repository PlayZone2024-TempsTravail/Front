import {Component, EventEmitter, Output} from '@angular/core';
import {RoleNewForm} from '../../forms/role.form';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RoleAddForm} from '../../models/role.model';

@Component({
  selector: 'app-new-role-form',
  templateUrl: './new-role-form.component.html',
  styleUrl: './new-role-form.component.scss'
})
export class NewRoleFormComponent {
    @Output() formSubmit = new EventEmitter<RoleAddForm>();

    roleAddForm: FormGroup;

    constructor(private _fb: FormBuilder) {
        this.roleAddForm = this._fb.group({...RoleNewForm});
    }

    submit() {
        if (this.roleAddForm.invalid) {
            this.roleAddForm.markAllAsTouched();
            return;
        }

        const formValue = this.roleAddForm.value;

        const roleForm: RoleAddForm = {
            ...formValue,
        };

        this.formSubmit.emit(roleForm);
        this.roleAddForm.reset()
    }
}
