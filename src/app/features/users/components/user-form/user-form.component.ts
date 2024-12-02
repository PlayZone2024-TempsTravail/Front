import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HistoriqueEntry, Role, UserDTO, UserForm} from '../../models/user.dto.model';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserCreateUpdateForm} from '../../forms/user.form';

// Importation des modules nécessaires
@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.scss'
})


export class UserFormComponent implements OnInit {
    @Input() userData: UserDTO | null  = null; // objet de type UserDTO ou null et sert à préremplir le formulaire d'ajout OU de modif
    @Output() formSubmit = new EventEmitter<UserForm>();  // objet de type UserForm qui va émettre les données du formulaire au composant parent (form d'ajout OU modification).

    userForm: FormGroup; // Formulaire réactif pour ajout ou modification d'un utilisateur
    roles: Role[] = []; // Liste des rôles disponibles pour le dropdown
    statusOptions = [ // liste des options pour le statut de l'utilisateur
        { label: 'Actif', value: true },
        { label: 'Inactif', value: false },
    ];
    displayHistoryDialog: boolean = false; // pour afficher la fenêtre de dialogue de l'historique
    historique: HistoriqueEntry[] = []; // Historique des salaires et des régimes

    // Constructeur avec injection de dépendances (de FormBuilder et UserService)
    constructor(private _fb: FormBuilder, private userService: UserService) {
        // Initialisation du formulaire avec des validations
        this.userForm = this._fb.group({...UserCreateUpdateForm});
    }

    ngOnInit(): void {
        console.log('userData reçu :', this.userData);
        // Récupérer les rôles depuis le service
        this.userService.getRoles().subscribe((roles) => {
            this.roles = roles;
        });
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
