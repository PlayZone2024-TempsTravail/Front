import {Validators} from '@angular/forms';

export const userForm = {
    nom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    prenom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: [null, [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role_Id: [null, Validators.required],
    VA: [20],
    VAEX: [5],
    RC: [10]

}
