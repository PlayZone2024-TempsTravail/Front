import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserForm} from '../../models/user.form.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})

export class UserFormComponent implements OnInit {
    userForm!: FormGroup;

    roles = [
        { label: 'Admin', value: 1 },
        { label: 'Employé', value: 2 },
        { label: 'Chargé de mission', value: 3 }
    ];

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
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
    }

    // Fonction appelée lors de la soumission du formulaire
    onSubmit() {
        if (this.userForm.valid) {
            const newUser: UserForm = this.userForm.value;
            // Vous pourrez appeler votre service pour ajouter l'utilisateur
            console.log('Nouvel utilisateur ajouté :', newUser);
            // Réinitialiser le formulaire si nécessaire
            this.userForm.reset({
                heures_annuelles_prestables: 1600,
                VA: 20,
                VAEX: 5,
                RC: 10,
            });
        }
    }
}
