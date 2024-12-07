import { Component, OnInit } from '@angular/core';
import { UserDTO, UserForm } from '../../models/user.dto.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    users: UserDTO[] = [];
    filteredUsers: UserDTO[] = [];
    selectedUser: UserDTO | null = null;
    displayForm: boolean = false;
    searchQuery: string = '';

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.sortUsers();
                this.filteredUsers = [...this.users];
            },
            error: (err) => {
                console.error("Erreur chargement utilisateurs:", err);
            }
        });
    }

    sortUsers() {
        this.users.sort((a, b) => Number(b.isActive) - Number(a.isActive));
    }

    openAddUserForm() {
        this.selectedUser = null;
        this.displayForm = true;
    }

    openEditUserForm(user: UserDTO) {
        this.selectedUser = user;
        this.displayForm = true;
    }

    onFormSubmit(userForm: UserForm): void {
        if (this.selectedUser) {
            // Mode modification
            this.userService.getUserById(this.selectedUser.idUser).subscribe({
                next: (existingUser) => {
                    const newRoles = userForm.roles;
                    const addSalaireNeeded = userForm.date && userForm.montant !== undefined && userForm.regime !== undefined;
                    const userFieldsChanged = (
                        userForm.nom !== existingUser.nom ||
                        userForm.prenom !== existingUser.prenom ||
                        userForm.email !== existingUser.email ||
                        (userForm.isActive !== undefined && userForm.isActive !== existingUser.isActive)
                    );

                    // Mettre à jour les rôles
                    this.userService.updateUserRoles(existingUser.idUser, newRoles).subscribe({
                        next: () => {
                            // Ajouter salaire si besoin
                            if (addSalaireNeeded) {
                                this.userService.addUserSalaire(existingUser.idUser, userForm.date!, userForm.regime!, userForm.montant!).subscribe({
                                    next: () => {
                                        // Re-fetch user pour être à jour
                                        this.userService.getUserById(existingUser.idUser).subscribe({
                                            next: (updatedUserAfterSalaire) => {
                                                if (userFieldsChanged) {
                                                    this.userService.updateUserFull(updatedUserAfterSalaire.idUser, userForm).subscribe({
                                                        next: () => {
                                                            this.displayForm = false;
                                                            this.loadUsers();
                                                        },
                                                        error: (err) => {
                                                            console.error("Erreur updateUserFull:", err);
                                                        }
                                                    });
                                                } else {
                                                    this.displayForm = false;
                                                    this.loadUsers();
                                                }
                                            },
                                            error: (err) => {
                                                console.error("Erreur getUserById après addSalaire:", err);
                                            }
                                        });
                                    },
                                    error: (err) => {
                                        console.error("Erreur lors de l'ajout du salaire :", err);
                                    }
                                });
                            } else {
                                // Pas de salaire à ajouter
                                // Re-fetch user pour avoir les rôles à jour
                                this.userService.getUserById(existingUser.idUser).subscribe({
                                    next: (updatedUserAfterRoles) => {
                                        if (userFieldsChanged) {
                                            this.userService.updateUserFull(updatedUserAfterRoles.idUser, userForm).subscribe({
                                                next: () => {
                                                    this.displayForm = false;
                                                    this.loadUsers();
                                                },
                                                error: (err) => {
                                                    console.error("Erreur updateUserFull:", err);
                                                }
                                            });
                                        } else {
                                            this.displayForm = false;
                                            this.loadUsers();
                                        }
                                    },
                                    error: (err) => {
                                        console.error("Erreur getUserById après updateUserRoles:", err);
                                    }
                                });
                            }
                        },
                        error: (err) => {
                            console.error("Erreur lors de la mise à jour des rôles :", err);
                        }
                    });
                },
                error: (err) => {
                    console.error("Erreur getUserById:", err);
                }
            });

        } else {
            // Mode ajout
            this.userService.addUser(userForm).subscribe({
                next: () => {
                    this.displayForm = false;
                    this.loadUsers();
                },
                error: (err) => {
                    console.error('Erreur lors de l\'ajout de l\'utilisateur :', err);
                    if (err.error) {
                        console.error('Détails de l\'erreur :', err.error);
                    }
                },
            });
        }
    }

    filterUsers(filter: string) {
        switch (filter) {
            case 'Admin':
                this.filteredUsers = this.users.filter((u) =>
                    u.userRoles.some((role) => role.roleName === filter)
                );
                break;
            case 'Employé':
                this.filteredUsers = this.users.filter((u) =>
                    u.userRoles.some((role) => role.roleName === 'Employe')
                );
                break;
            case 'Chargés de projet':
                this.filteredUsers = this.users.filter((u) =>
                    u.userRoles.some((role) => role.roleName === 'Chargés de projet')
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

    searchUsers() {
        this.filteredUsers = this.users.filter((u) =>
            `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    onDialogHide() {
        this.displayForm = false;
    }
}
