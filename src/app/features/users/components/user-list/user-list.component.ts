import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import {ActivatedRoute} from '@angular/router';
import {UserForm} from '../../models/user.form.model';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

    // Utilisateur sélectionné pour modification
    selectedUser: UserForm | null = null;

    // Liste des utilisateurs
    users: User[] = [];

    // Options de rôles pour le filtrage
    roles: any[] = [];

    // Contrôle de l'affichage des dialogues
    displayAddUserDialog: boolean = false;
    displayModifyUserDialog: boolean = false;

    constructor(private readonly route: ActivatedRoute) { }

    ngOnInit(): void {
        // On récup la liste des utilisateurs préchargée par le resolver
        this.route.data.subscribe(data => {
            this.users = data['users'];
        });
    }

    // Méthode pour obtenir le nom du rôle à parrit de l'id -> pour la liste des utilisateurs
    getRoleName(roleId: number): string {
        switch (roleId) {
            case 1:
                return 'Admin';
            case 2:
                return 'Employé';
            case 3:
                return 'Chargé de mission';
            default:
                return 'Inconnu';
        }
    }

    // Afficher la boîte de dialogue pour ajouter un utilisateur
    showAddUserDialog() {
        this.displayAddUserDialog = true;
    }

    // Afficher la boîte de dialogue pour modifier un utilisateur sélectionné
    showModifyUserDialog(user: User) {
        this.selectedUser = user;
        this.displayModifyUserDialog = true;
    }

    // Fonction appelée lors de l'ajout d'un utilisateur
    onAddUser() {
        this.displayAddUserDialog = false;
    }

    // Fonction appelée lors de la modification d'un utilisateur
    onModifyUser() {
        this.displayModifyUserDialog = false;
    }
}
