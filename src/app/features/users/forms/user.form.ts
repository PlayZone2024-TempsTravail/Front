import {Validators} from '@angular/forms';

export const UserCreateUpdateForm = {
    nom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    prenom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null],
    roles: [null, Validators.required],
    montant: [null, Validators.required],
    regime: [null, Validators.required],
    date: [null, Validators.required],
    isActive: [true],
};
