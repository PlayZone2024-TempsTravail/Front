import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HistoriqueEntry, Role, UserDTO, UserForm} from '../../models/user.dto.model';
import {UserService} from '../../services/user.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

// Importation des modules nécessaires
@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.scss'
})


export class UserFormComponent implements OnInit {
    @Input() userData: any = null; // Données préchargées pour la modification
    @Output() formSubmit = new EventEmitter<UserForm>(); // Permet de notifier les composants parents de l'événement de soumission du formulaire

    userForm: FormGroup; // Formulaire réactif pour ajout ou modification d'un utilisateur
    roles: Role[] = []; // Liste des rôles disponibles
    statusOptions = [ // liste options pour le statut de l'utilisateur
        { label: 'Actif', value: true },
        { label: 'Inactif', value: false },
    ];

    displayHistoryDialog: boolean = false; // pour afficher la fenêtre de dialogue pour afficher l'historique'
    historique: HistoriqueEntry[] = []; // Historique des salaires et des régimes

    // Constructeur avec injection de dépendances (FormBuilder et UserService)
    constructor(private fb: FormBuilder, private userService: UserService) {
        // Initialisation du formulaire avec des validations
        this.userForm = this.fb.group({
            nom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            prenom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            email: [null, [Validators.required, Validators.email]],
            roles: [null, Validators.required],
            salaire: [null, Validators.required],
            regime: [null, Validators.required],
            date: [null, Validators.required],
            isActive: [true],
        });
    }

    ngOnInit(): void {
        // Récupérer les rôles depuis le service
        this.userService.getRoles().subscribe((roles) => {
            this.roles = roles;

            // Si données de l'utilisateur sont préchargées, précharger les champs du formulaire pour la modification'
            if (this.userData) {
                // Précharger les données de l'utilisateur pour la modification
                this.userForm.patchValue({
                    nom: this.userData.nom,
                    prenom: this.userData.prenom,
                    email: this.userData.email,
                    roles: this.userData.roles.map((role: Role) => role.idRole),
                    // Pour le salaire, le régime et la date, on peut prendre la dernière entrée de l'historique
                    salaire: this.userData.historique[0]?.salaire || null,
                    regime: this.userData.historique[0]?.regime || null,
                    date: this.userData.historique[0]?.date || null,
                    isActive: this.userData.isActive,
                });
                this.historique = this.userData.historique;
            }
        });
    }

    openHistory() {
        this.displayHistoryDialog = true;
    }

    closeHistory() {
        this.displayHistoryDialog = false;
    }

    // Données du formulaire émises au composant parent
    onSubmit() {
        if (this.userForm.valid) {
            // Émettre les données du formulaire au parent
            const formValue = this.userForm.value;
            const userForm: UserForm = {
                nom: formValue.nom,
                prenom: formValue.prenom,
                email: formValue.email,
                password: this.userData ? this.userData.password : 'defaultPassword', // Gérer le mot de passe
                roles: formValue.roles,
                salaire: formValue.salaire,
                regime: formValue.regime,
                date: formValue.date,
                isActive: this.userForm.get('isActive')?.value,
            };
            this.formSubmit.emit(userForm);
        }
    }
}

//     // Déclaration d'une propriété d'entrée pour recevoir un utilisateur existant et préremplir le formulaire avec ses infos
//     @Input() user: UserForm | null = null;
//
//     // Déclaration du formulaire réactif
//     userForm!: FormGroup;
//
//     // Liste des rôles disponibles pour le dropdown du form
//     roles = [
//         { label: 'Admin', value: 1 },
//         { label: 'Employé', value: 2 },
//         { label: 'Chargé de mission', value: 3 }
//     ];
//
//     // Liste des options de statut pour le dropdown du form
//     statusOptions = [
//         { label: 'Actif', value: true },
//         { label: 'Inactif', value: false }
//     ];
//
//     // Injection du FormBuilder pour construire le formulaire
//     constructor(private _fb: FormBuilder,
//                 private readonly _ar: ActivatedRoute,
//                 private readonly _userService: UserService)
//     {
//         this.userForm = this._fb.group(userForm);
//         this.userId = +this._ar.snapshot.params['id'];
//         this._userService.getUserById(1).subscribe({
//             next: (user: User) => {
//                 //id_user: number;
//                 //     role_Id: number;
//                 //     isActive: boolean;
//                 //     nom: string;
//                 //     prenom: string;
//                 //     email: string;
//                 //     VA: number;
//                 //     VAEX: number;
//                 //     RC: number;
//                 this.userForm.setValue({
//                     role_Id: user.role_Id,
//                     isActive: user.isActive,
//                     nom: user.nom,
//                     prenom: user.prenom,
//                     email: user.email,
//                     VA: user.VA,
//                     VAEX: user.VAEX,
//                     RC: user.RC
//                 });
//             }
//         });
//         }
//         this.userId = +this._ar.snapshot.params['id'];
//         this._userService.getUserById(1).subscribe({
//             next: (user: User) => {
//                 //id_user: number;
//                 //     role_Id: number;
//                 //     isActive: boolean;
//                 //     nom: string;
//                 //     prenom: string;
//                 //     email: string;
//                 //     VA: number;
//                 //     VAEX: number;
//                 //     RC: number;
//                 this.userForm.setValue({
//                     role_Id: user.role_Id,
//                     isActive: user.isActive,
//                     nom: user.nom,
//                     prenom: user.prenom,
//                     email: user.email,
//                     VA: user.VA,
//                     VAEX: user.VAEX,
//                     RC: user.RC
//                 });
//             }
//         });
//     }
//
//     submit() {
//         if(this.userForm.invalid) {
//             return;
//         }
//             console.log('Le formulaire est valide');
//             const userData: UserForm = this.userForm.value;
//
//             if (this.user) {
//                 console.log('Utilisateur modifié :', userData);
//                 this._userService.updateUser(this.userId, userData).subscribe({
//                     next: (user: User) => {
//                         console.log('Utilisateur modifié avec succès :', user);
//                     },
//                     error: (err: HttpErrorResponse) => {
//                         console.error('Erreur lors de la modification de l\'utilisateur :', err.error);
//                     }
//                 });
//             }
//         else {
//             console.log('Nouvel utilisateur ajouté :', userData);
//             this._userService.addUser(userData).subscribe({
//                 next: (user: User) => {
//                     console.log('Utilisateur ajouté avec succès :', user);
//                 },
//                 error: (err: HttpErrorResponse) => {
//                     console.log(err.error);
//                 }
//             })
//         if(this.userForm.invalid) {
//             return;
//         }
//         console.log('Le formulaire est valide');
//         const userData: UserForm = this.userForm.value;
//
//         if (this.user) {
//             console.log('Utilisateur modifié :', userData);
//             this._userService.updateUser(this.userId, userData).subscribe({
//                 next: (user: User) => {
//                     console.log('Utilisateur modifié avec succès :', user);
//                 },
//                 error: (err: HttpErrorResponse) => {
//                     console.error('Erreur lors de la modification de l\'utilisateur :', err.error);
//                 }
//             });
//         }
//         else {
//             console.log('Nouvel utilisateur ajouté :', userData);
//             this._userService.addUser(userData).subscribe({
//                 next: (user: User) => {
//                     console.log('Utilisateur ajouté avec succès :', user);
//                 },
//                 error: (err: HttpErrorResponse) => {
//                     console.log(err.error);
//                 }
//             })
//         }
//         else {
//             console.log('Le formulaire est invalide');
//         }
//     }
// }
