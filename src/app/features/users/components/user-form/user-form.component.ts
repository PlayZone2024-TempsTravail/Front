import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserForm} from '../../models/user.form.model';

// Importation des modules nécessaires
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})

export class UserFormComponent implements OnInit {
    // Déclaration d'une propriété d'entrée pour recevoir un utilisateur existant
    @Input() user: UserForm | null = null;

    // Déclaration du formulaire réactif
    userForm!: FormGroup;

    // Liste des rôles disponibles pour le dropdown du form
    roles = [
        { label: 'Admin', value: 1 },
        { label: 'Employé', value: 2 },
        { label: 'Chargé de mission', value: 3 }
    ];

    // Injection du FormBuilder pour construire le formulaire
    constructor(private fb: FormBuilder) { }

    // Initialisation du composant
    ngOnInit(): void {
        // Construction du formulaire avec les contrôles et les validateurs
        this.userForm = this.fb.group({
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            role_Id: [null, Validators.required],
            heures_annuelles_prestables: [1600, Validators.required],
            VA: [20],
            VAEX: [5],
            RC: [10]
        });

        // Si un utilisateur est passé en entrée, pré-remplir le formulaire
        if (this.user) {
            this.userForm.patchValue(this.user);
        }
    }

    // Fonction appelée lors de la soumission du formulaire
    onSubmit() {
        if (this.userForm.valid) {
            const userData: UserForm = this.userForm.value;
            if (this.user) {
                // TODO : Si un utilisateur existe, c'est une modification
                console.log('Utilisateur modifié :', userData);
            } else {
                // Sinon, c'est un ajout
                console.log('Nouvel utilisateur ajouté :', userData);
            }
            // Réinitialiser le formulaire après soumission
            this.userForm.reset({
                heures_annuelles_prestables: 1600,
                VA: 20,
                VAEX: 5,
                RC: 10,
            });
        }
    }
}
