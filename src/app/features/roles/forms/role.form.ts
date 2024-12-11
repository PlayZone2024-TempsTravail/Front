import {Validators} from '@angular/forms';

export const RoleNewForm = {
    name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
}

export const RoleModifyForm = {
    role: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
}

export const RoleRemoveForm = {
    role: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
}
