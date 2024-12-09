import {Validators} from '@angular/forms';

export const UserCreateUpdateForm = {
    nom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    prenom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null],
    roles: [null, Validators.required],
    // On ne met pas de required par défaut ici, on les activera en mode ajout dans le composant
    montant: [null],
    regime: [null],
    date: [null],
    isActive: [true],
};
