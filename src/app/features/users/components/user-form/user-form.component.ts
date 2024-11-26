import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserForm} from '../../models/user.form.model';
import {userForm} from '../../forms/user-form';

// Importation des modules nécessaires
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})

export class UserFormComponent implements OnInit {
    // Déclaration d'une propriété d'entrée pour recevoir un utilisateur existant et préremplir le formulaire avec ses infos
    @Input() user: UserForm | null = null;

    // Déclaration du formulaire réactif
    userForm!: FormGroup;

    // Liste des rôles disponibles pour le dropdown du form
    roles = [
        { label: 'Admin', value: 1 },
        { label: 'Employé', value: 2 },
        { label: 'Chargé de mission', value: 3 }
    ];

    // Liste des options de statut pour le dropdown du form
    statusOptions = [
        { label: 'Actif', value: true },
        { label: 'Inactif', value: false }
    ];

    // Injection du FormBuilder pour construire le formulaire
    constructor(private _fb: FormBuilder) {
        this.userForm = this._fb.group(userForm);
    }

    // Initialisation du composant
    ngOnInit(): void {
        // Si un utilisateur est passé en entrée, pré-remplir le formulaire
        if (this.user) {
            this.userForm.patchValue(this.user);
        }
    }

    // Fonction appelée lors de la soumission du formulaire
    submit() {
        if (this.userForm.valid) {
            console.log('Le formulaire est valide');
            const userData: UserForm = this.userForm.value;
            if (this.user) {
                console.log('Utilisateur modifié :', userData);
            } else {
                console.log('Nouvel utilisateur ajouté :', userData);
            }
        }
        else {
            console.log('Le formulaire est invalide');
        }
    }
}
