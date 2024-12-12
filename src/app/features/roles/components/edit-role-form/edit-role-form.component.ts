import {Component, EventEmitter, Input, Output} from '@angular/core'
import {Role, RoleEditForm} from '../../models/role.model'
import {FormBuilder, FormGroup} from '@angular/forms'
import {RoleModifyForm} from '../../forms/role.form'

@Component({
  selector: 'app-edit-role-form',
  templateUrl: './edit-role-form.component.html',
  styleUrl: './edit-role-form.component.scss'
})
export class EditRoleFormComponent {
    @Output() formSubmit = new EventEmitter<RoleEditForm>()
    @Input() roles!: Role[]

    roleEditForm: FormGroup

    constructor(private _fb: FormBuilder) {
        this.roleEditForm = this._fb.group({...RoleModifyForm})
    }

    submit() {
        if (this.roleEditForm.invalid) {
            this.roleEditForm.markAllAsTouched()
            return
        }

        const formValue = this.roleEditForm.value;

        const roleEditForm: RoleEditForm = {
            idRole: formValue.role.idRole,
            name: formValue.name,
        };

        this.formSubmit.emit(roleEditForm);
        this.roleEditForm.reset()
    }
}
