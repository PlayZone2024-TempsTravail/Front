import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HistoriqueEntry, Role, UserDTO, UserForm} from '../../models/user.dto.model';
import {UserService} from '../../services/user.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {UserCreateUpdateForm} from '../../forms/user.form';

// Importation des modules nécessaires
@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.scss'
})


export class UserFormComponent implements OnInit {
    @Input() userData: UserDTO | null  = null; // Données préchargées pour la modification
    @Output() formSubmit = new EventEmitter<UserForm>();

    userForm: FormGroup; // Formulaire réactif pour ajout ou modification d'un utilisateur
    roles: Role[] = []; // Liste des rôles disponibles
    statusOptions = [ // liste options pour le statut de l'utilisateur
        { label: 'Actif', value: true },
        { label: 'Inactif', value: false },
    ];

    displayHistoryDialog: boolean = false; // pour afficher la fenêtre de dialogue pour afficher l'historique'
    historique: HistoriqueEntry[] = []; // Historique des salaires et des régimes

    // Constructeur avec injection de dépendances (FormBuilder et UserService)
    constructor(private _fb: FormBuilder, private userService: UserService, private readonly _router: Router) {
        // Initialisation du formulaire avec des validations
        this.userForm = this._fb.group({
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
        console.log('userData reçu :', this.userData);
        // Récupérer les rôles depuis le service
        this.userService.getRoles().subscribe((roles) => {
            this.roles = roles;
        });
        // // Récupérer les rôles depuis le service
        // this.userService.getRoles().subscribe((roles) => {
        //     this.roles = roles;
        //
        //     // Si données de l'utilisateur sont préchargées, précharger les champs du formulaire pour la modification'
        //     if (this.userData) {
        //         // Précharger les données de l'utilisateur pour la modification
        //         this.userForm.patchValue({
        //             nom: this.userData.nom,
        //             prenom: this.userData.prenom,
        //             email: this.userData.email,
        //             roles: this.userData.roles.map((role: Role) => role.idRole),
        //             salaire: this.userData.historique[0]?.salaire || null,
        //             regime: this.userData.historique[0]?.regime || null,
        //             date: this.userData.historique[0]?.date || null,
        //             isActive: this.userData.isActive,
        //         });
        //         this.historique = this.userData.historique;
        //     }
        // });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['userData'] && changes['userData'].currentValue) {
            console.log('userData mis à jour :', this.userData);
            this.preloadFormData();
        }
    }

    private preloadFormData() {
        if (this.userData) {
            console.log('Préchargement des données du formulaire avec userData :', this.userData);
            this.userForm.patchValue({
                nom: this.userData.nom,
                prenom: this.userData.prenom,
                email: this.userData.email,
                roles: this.userData.roles.map((role: Role) => role.idRole),
                salaire: this.userData.historique[0]?.salaire || null,
                regime: this.userData.historique[0]?.regime || null,
                date: this.userData.historique[0]?.date || null,
                isActive: this.userData.isActive,
            });
            this.historique = this.userData.historique;
        }
    }

    openHistory() {
        this.displayHistoryDialog = true;
    }

    closeHistory() {
        this.displayHistoryDialog = false;
    }

    // Données du formulaire émises au composant parent
    // submit() {
    //     if (this.userForm.invalid) {
    //         this.userForm.markAllAsTouched();
    //         return;
    //     }
    //     // Émettre les données du formulaire au parent
    //     const formValue = this.userForm.value;
    //     console.log(formValue); // c'est ok ca
    //
    //     // Transformez les IDs des rôles en objets de rôle complets
    //     const roles = formValue.roles.map((roleId: number) => {
    //         return this.roles.find(role => role.idRole === roleId);
    //     });
    //
    //     const newUser = {
    //         ...formValue,
    //         roles: roles
    //     };
    //
    //     this.userService.addUser(newUser).subscribe({
    //         next: (user: UserDTO) => {
    //             console.log('Utilisateur ajouté avec succès :', user);
    //             this.formSubmit.emit();
    //
    //         },
    //         error: (err: HttpErrorResponse) => {
    //             console.error('Erreur lors de l\'ajout de l\'utilisateur :', err.error);
    //         }
    //     });
    // }

    submit() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        // Émettre les données du formulaire au composant parent
        const formValue = this.userForm.value;

        const userForm: UserForm = {
            ...formValue,
        };

        this.formSubmit.emit(userForm);
    }
}
