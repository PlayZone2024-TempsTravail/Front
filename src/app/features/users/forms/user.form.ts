import {Validators} from '@angular/forms';

export const UserCreateUpdateForm = {
    nom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    prenom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: [null, [Validators.required, Validators.email]],
    roles: [null, Validators.required],
    salaire: [null, Validators.required],
    regime: [null, Validators.required],
    date: [null, Validators.required],
    isActive: [true],
}
