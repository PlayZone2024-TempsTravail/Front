import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Role, RoleDeleteForm} from '../../models/role.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RoleRemoveForm} from '../../forms/role.form';

@Component({
  selector: 'app-remove-role-form',
  templateUrl: './remove-role-form.component.html',
  styleUrl: './remove-role-form.component.scss'
})
export class RemoveRoleFormComponent {
    @Input() roles: Role[] = [];
    @Output() formSubmit = new EventEmitter<RoleDeleteForm>();

    roleRemoveForm: FormGroup;

    constructor(private _fb: FormBuilder) {
        this.roleRemoveForm = this._fb.group({...RoleRemoveForm});
    }

    submit() {
        if (this.roleRemoveForm.invalid) {
            this.roleRemoveForm.markAllAsTouched();
            return;
        }

        const formValue = this.roleRemoveForm.value;

        const roleRemoveForm: RoleDeleteForm = {
            ...formValue,
        };

        this.formSubmit.emit(roleRemoveForm);
        this.roleRemoveForm.reset()
    }
}
