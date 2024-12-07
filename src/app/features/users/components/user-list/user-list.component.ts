import { Component, OnInit } from '@angular/core';
import { UserDTO, UserForm } from '../../models/user.dto.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    users: UserDTO[] = []; // Liste complète des utilisateurs.
    filteredUsers: UserDTO[] = []; // Liste filtrée des utilisateurs, basée sur les critères de recherche ou de filtrage.
    selectedUser: UserDTO | null = null; // Utilisateur sélectionné pour l'édition. Null signifie qu'aucun utilisateur n'est actuellement sélectionné.
    displayForm: boolean = false; // Indique si le formulaire d'ajout/édition est affiché.
    searchQuery: string = ''; // Chaîne de recherche utilisée pour filtrer les utilisateurs par nom, prénom ou email.

    constructor(private userService: UserService) {}

    // Charge la liste des utilisateurs depuis le service.
    ngOnInit(): void {
        this.loadUsers();
    }

    /**
     * Charge les utilisateurs depuis le service et met à jour la liste complète `users` ainsi que la liste filtrée `filteredUsers`.
     * Trie également la liste d'utilisateurs après le chargement.
     *
     * @returns void
     */
    loadUsers() : void {
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


    /**
     * Trie la liste d'utilisateurs en plaçant en premier les utilisateurs actifs.
     *
     * @returns void
     */
    sortUsers(): void {
        this.users.sort((a, b) => Number(b.isActive) - Number(a.isActive));
    }

    /**
     * Ouvre le formulaire pour ajouter un nouvel utilisateur.
     * Réinitialise l'utilisateur sélectionné.
     *
     * @returns void
     */
    openAddUserForm() : void {
        this.selectedUser = null;
        this.displayForm = true;
    }

    /**
     * * Ouvre le formulaire pour modifier un utilisateur existant.
     *
     * @param user L'utilisateur à modifier.
     * @returns void
     */
    openEditUserForm(user: UserDTO) : void {
        this.selectedUser = user;
        this.displayForm = true;
    }


    /**
     * Soumet les données du formulaire utilisateur.
     * Si un utilisateur est sélectionné, effectue une mise à jour (rôles, salaire, informations).
     * Sinon, ajoute un nouvel utilisateur.
     *
     * @param userForm Les données du formulaire (`UserForm`).
     * @returns void
     */
    onFormSubmit(userForm: UserForm): void {
        if (this.selectedUser) { // Vérifie si un utilisateur est sélectionné pour déterminer si on est en mode modification

            // Mode modification
            this.userService.getUserById(this.selectedUser.idUser).subscribe({ // On récupère l'utilisateur existant via son id
                next: (existingUser) => { // Une fois les informations récupérées, on procède aux mises à jour
                    // newRoles : S'il y a de nouveaux rôles dans le formulaire, on les utilise
                    const newRoles = userForm.roles;

                    // newSalaire : Vérifie si toutes les données nécessaires à l'ajout d'un salaire (date, régime, montant) sont présentes
                    const newSalaire = userForm.date && userForm.montant !== undefined && userForm.regime !== undefined;

                    // Vérifie si les champs utilisateur ont été modifiés par rapport aux données existantes
                    const userFieldsChanged = (
                        userForm.nom !== existingUser.nom ||
                        userForm.prenom !== existingUser.prenom ||
                        userForm.email !== existingUser.email ||
                        (userForm.isActive !== undefined && userForm.isActive !== existingUser.isActive)
                    );

                    // Mettre à jour les rôles de l'utilisateur
                    this.userService.updateUserRoles(existingUser.idUser, newRoles).subscribe({
                        next: () => {
                            // Ajouter salaire si nécessaire
                            if (newSalaire) {
                                this.userService.addUserSalaire(existingUser.idUser, userForm.date!, userForm.regime!, userForm.montant!).subscribe({
                                    next: () => {
                                        // Re-fetch l'utilisateur après avoir ajouté le salaire pour s'assurer que les données sont à jour
                                        this.userService.getUserById(existingUser.idUser).subscribe({
                                            next: (updatedUserAfterSalaire) => {
                                                if (userFieldsChanged) { // Si d'autres champs utilisateur ont changé
                                                    this.userService.updateUserFull(updatedUserAfterSalaire.idUser, userForm).subscribe({
                                                        next: () => {
                                                            this.displayForm = false;
                                                            this.loadUsers();
                                                        },
                                                        error: (err) => {
                                                            console.error("Erreur updateUserFull:", err); // Gère les erreurs de mise à jour complète de l'utilisateur
                                                        }
                                                    });
                                                } else {
                                                    this.displayForm = false; // Si aucun autre champ n'a changé, ferme juste le formulaire
                                                    this.loadUsers();
                                                }
                                            },
                                            error: (err) => {
                                                console.error("Erreur getUserById après addSalaire:", err); // Gère les erreurs de récupération après ajout de salaire
                                            }
                                        });
                                    },
                                    error: (err) => {
                                        console.error("Erreur lors de l'ajout du salaire :", err); // Gère les erreurs d'ajout de salaire
                                    }
                                });
                            } else {
                                // Pas de salaire à ajouter, on met à jour les rôles et d'autres champs si nécessaire
                                this.userService.getUserById(existingUser.idUser).subscribe({
                                    next: (updatedUserAfterRoles) => {
                                        if (userFieldsChanged) { // Si d'autres champs utilisateur ont changé
                                            this.userService.updateUserFull(updatedUserAfterRoles.idUser, userForm).subscribe({
                                                next: () => {
                                                    this.displayForm = false;
                                                    this.loadUsers();
                                                },
                                                error: (err) => {
                                                    console.error("Erreur updateUserFull:", err); // Gère les erreurs de mise à jour complète de l'utilisateur
                                                }
                                            });
                                        } else {
                                            this.displayForm = false;
                                            this.loadUsers();
                                        }
                                    },
                                    error: (err) => {
                                        console.error("Erreur getUserById après updateUserRoles:", err); // Gère les erreurs de récupération après mise à jour des rôles
                                    }
                                });
                            }
                        },
                        error: (err) => {
                            console.error("Erreur lors de la mise à jour des rôles :", err);  // Gère les erreurs de mise à jour des rôles
                        }
                    });
                },
                error: (err) => {
                    console.error("Erreur getUserById:", err); // Gère les erreurs lors de la récupération initiale de l'utilisateur
                }
            });

        } else {
            // Mode ajout : Si aucun utilisateur n'est sélectionné, on ajoute un nouvel utilisateur
            this.userService.addUser(userForm).subscribe({
                next: () => {
                    this.displayForm = false;
                    this.loadUsers();
                },
                error: (err) => {
                    console.error('Erreur lors de l\'ajout de l\'utilisateur :', err); // Gère les erreurs lors de l'ajout
                    if (err.error) {
                        console.error('Détails de l\'erreur :', err.error); // Affiche des détails supplémentaires sur l'erreur si disponibles
                    }
                },
            });
        }
    }

    /**
     * Filtre les utilisateurs en fonction du critère spécifié.
     *
     * @param filter Le critère de filtrage (par exemple 'Admin', 'Employé', 'Actifs', 'Inactifs').
     * @returns void
     */
    filterUsers(filter: string) : void {
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

    /**
     * Filtre les utilisateurs en fonction de la chaîne de recherche `searchQuery`.
     * Filtre sur nom, prénom et email en ignorants la casse.
     */
    searchUsers(): void {
        this.filteredUsers = this.users.filter((u) =>
            `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    /**
     * Méthode appelée lorsque la boîte de dialogue du formulaire est fermée.
     * Masque le formulaire d'ajout/édition.
     */
    onDialogHide(): void {
        this.displayForm = false;
    }
}
