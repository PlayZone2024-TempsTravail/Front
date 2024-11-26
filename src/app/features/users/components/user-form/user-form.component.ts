import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserForm} from '../../models/user.form.model';
import {userForm} from '../../forms/user-form';
import {User} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

// Importation des modules nécessaires
@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.scss'
})

export class UserFormComponent {

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
    constructor(private _fb: FormBuilder,
                private readonly _ar: ActivatedRoute,
                private readonly _userService: UserService)
    {
        this.userForm = this._fb.group(userForm);
        this.userId = +this._ar.snapshot.params['id'];
        this._userService.getUserById(1).subscribe({
            next: (user: User) => {
                //id_user: number;
                //     role_Id: number;
                //     isActive: boolean;
                //     nom: string;
                //     prenom: string;
                //     email: string;
                //     VA: number;
                //     VAEX: number;
                //     RC: number;
                this.userForm.setValue({
                    role_Id: user.role_Id,
                    isActive: user.isActive,
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    VA: user.VA,
                    VAEX: user.VAEX,
                    RC: user.RC
                });
            }
        });
        }
        this.userId = +this._ar.snapshot.params['id'];
        this._userService.getUserById(1).subscribe({
            next: (user: User) => {
                //id_user: number;
                //     role_Id: number;
                //     isActive: boolean;
                //     nom: string;
                //     prenom: string;
                //     email: string;
                //     VA: number;
                //     VAEX: number;
                //     RC: number;
                this.userForm.setValue({
                    role_Id: user.role_Id,
                    isActive: user.isActive,
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    VA: user.VA,
                    VAEX: user.VAEX,
                    RC: user.RC
                });
            }
        });
    }

    submit() {
        if(this.userForm.invalid) {
            return;
        }
            console.log('Le formulaire est valide');
            const userData: UserForm = this.userForm.value;

            if (this.user) {
                console.log('Utilisateur modifié :', userData);
                this._userService.updateUser(this.userId, userData).subscribe({
                    next: (user: User) => {
                        console.log('Utilisateur modifié avec succès :', user);
                    },
                    error: (err: HttpErrorResponse) => {
                        console.error('Erreur lors de la modification de l\'utilisateur :', err.error);
                    }
                });
            }
        else {
            console.log('Nouvel utilisateur ajouté :', userData);
            this._userService.addUser(userData).subscribe({
                next: (user: User) => {
                    console.log('Utilisateur ajouté avec succès :', user);
                },
                error: (err: HttpErrorResponse) => {
                    console.log(err.error);
                }
            })
        if(this.userForm.invalid) {
            return;
        }
        console.log('Le formulaire est valide');
        const userData: UserForm = this.userForm.value;

        if (this.user) {
            console.log('Utilisateur modifié :', userData);
            this._userService.updateUser(this.userId, userData).subscribe({
                next: (user: User) => {
                    console.log('Utilisateur modifié avec succès :', user);
                },
                error: (err: HttpErrorResponse) => {
                    console.error('Erreur lors de la modification de l\'utilisateur :', err.error);
                }
            });
        }
        else {
            console.log('Nouvel utilisateur ajouté :', userData);
            this._userService.addUser(userData).subscribe({
                next: (user: User) => {
                    console.log('Utilisateur ajouté avec succès :', user);
                },
                error: (err: HttpErrorResponse) => {
                    console.log(err.error);
                }
            })
        }
        else {
            console.log('Le formulaire est invalide');
        }
    }
}
