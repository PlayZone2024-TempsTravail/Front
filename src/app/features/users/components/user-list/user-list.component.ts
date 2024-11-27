import {Component, OnInit} from '@angular/core';
import {UserDTO, UserForm} from '../../models/user.dto.model';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

    users: UserDTO[] = []; // Liste complète des utilisateurs
    filteredUsers: UserDTO[] = [];
    selectedUser: UserDTO | null = null;
    displayForm: boolean = false;
    searchQuery: string = '';

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.refreshUsers();
    }
    refreshUsers() {
        // Récupère la liste des utilisateurs depuis le service
        this.userService.getUsers().subscribe((data) => {
            this.users = data;
            this.sortUsers();
            this.filteredUsers = [...this.users];
        });
    }

    // Filtre les utilisateurs selon le champ de recherche
    sortUsers() {
        // Trie les utilisateurs actifs en premier
        this.users.sort((a, b) => Number(b.isActive) - Number(a.isActive));
    }

    // Ouvre la boîte de dialogue pour ajouter un utilisateur
    openAddUserForm() {
        // Ouvre le formulaire pour ajouter un utilisateur
        this.selectedUser = null;
        this.displayForm = true;
    }

    // Ouvre la boîte de dialogue pour modifier un utilisateur sélectionné
    openEditUserForm(user: UserDTO) {
        // Ouvre le formulaire pour modifier un utilisateur
        this.selectedUser = user;
        this.displayForm = true;
    }

    // Méthode de submti du form
    onFormSubmit(userForm: any) {
        if (this.selectedUser) {
            // Mise à jour de l'utilisateur existant
            this.userService.updateUser(this.selectedUser.idUser, userForm).subscribe(() => {
                this.displayForm = false;
                this.refreshUsers();
            });
        } else {
            // Ajout d'un nouvel utilisateur
            this.userService.addUser(userForm).subscribe(() => {
                this.displayForm = false;
                this.refreshUsers();
            });
        }
    }

    // Désactive un utilisateur ( pas de suppression)
    deactivateUser(user: UserDTO) {
        // Désactive un utilisateur en mettant 'isActive' à false
        this.userService.deactivateUser(user.idUser).subscribe(() => {
            this.refreshUsers();
        });
    }

    // Filtre les utilisateurs en fonction du filtre sélectionné
    filterUsers(filter: string) {
        // Filtre les utilisateurs en fonction du filtre sélectionné
        switch (filter) {
            case 'Employé':
            case 'Admin':
                this.filteredUsers = this.users.filter((u) =>
                    u.roles.some((role) => role.name === filter)
                );
                break;
            case 'Actifs':
                this.filteredUsers = this.users.filter((u) => u.isActive);
                break;
            case 'Inactifs':
                this.filteredUsers = this.users.filter((u) => !u.isActive);
                break;
            default:
                this.filteredUsers = [...this.users];
        }
    }

    // Recherche intelligente parmi les utilisateurs
    searchUsers() {
        // Recherche intelligente parmi les utilisateurs
        this.filteredUsers = this.users.filter((u) =>
            `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    // Permet l'ouverture/fermeture de la pop up de formulaire
    onDialogHide() {
        // Réinitialiser le formulaire et l'utilisateur sélectionné lorsque le dialogue est fermé
        this.selectedUser = null;
        this.displayForm = false;
    }
}
