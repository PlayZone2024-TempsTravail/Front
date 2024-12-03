import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {forkJoin, map, Observable, switchMap} from 'rxjs';
import {UserSalaire, UserRole, UserDTO, UserForm, Role} from '../models/user.dto.model';

@Injectable({
    providedIn: 'root',
})

export class UserService {
    // url de notre ficheir JSON (future API)
    private apiUrl = 'http://api.technobel.pro:444/api';

    // HttpClient pour effectuer les requêtes HTTP vers l'API (ici, le fichier JSON)
    constructor(private _http: HttpClient) {}

    // Méthode pour récupérer la liste des utilisateurs
    getUsers(): Observable<UserDTO[]> {
        // Requête HTTP GET pour obtenir tous les utilisateurs
        return this._http.get<UserDTO[]>(`${this.apiUrl}/User`);
    }

    // Méthode pour récupérer un utilisateur par son ID
    getUserById(id: number): Observable<UserDTO> {
        // Requête HTTP GET pour obtenir l'utilisateur avec l'ID donné
        return this._http.get<UserDTO>(`${this.apiUrl}/User/id/${id}`);
    }

    // // Méthode pour ajouter un nouvel utilisateur
    // addUser(userForm: UserForm): Observable<UserDTO> {
    //     const newUserDTO: Omit<UserDTO, 'idUser'> = {
    //         nom: userForm.nom,
    //         prenom: userForm.prenom,
    //         email: userForm.email,
    //         isActive: userForm.isActive !== undefined ? userForm.isActive : true,
    //         userRoles: userForm.userRoles.map((roleId) => ({
    //             idRole: roleId,
    //             name: this.getRoleNameById(roleId),
    //         })),
    //         historique: [
    //             {
    //                 date: userForm.date,
    //                 montant: userForm.montant,
    //                 regime: userForm.regime,
    //             },
    //         ],
    //     };
    //     return this._http.post<UserDTO>(`${this.apiUrl}/users`, newUserDTO);
    // }

    addUser(userForm: UserForm): Observable<UserDTO> {
        const newUser = {
            nom: userForm.nom,
            prenom: userForm.prenom,
            email: userForm.email,
            password: userForm.password,
            isActive: userForm.isActive !== undefined ? userForm.isActive : true,
        };

        return this._http.post<UserDTO>(`${this.apiUrl}/User`, newUser).pipe(
            switchMap((createdUser) => {
                // Ajouter les rôles
                const roleObservables = userForm.roles.map((roleId) => {
                    const userRole = {
                        userId: createdUser.idUser,
                        roleId: roleId,
                    };
                    return this._http.post(`${this.apiUrl}/UserRole`, userRole);
                });

                // Ajouter le salaire
                const userSalaire = {
                    userId: createdUser.idUser,
                    date: userForm.date,
                    regime: userForm.regime,
                    montant: userForm.montant,
                };
                const salaireObservable = this._http.post(`${this.apiUrl}/UserSalaire`, userSalaire);

                // Exécuter toutes les requêtes en parallèle
                return forkJoin([...roleObservables, salaireObservable]).pipe(
                    map(() => createdUser)
                );
            })
        );
    }


    // // Méthode pour mettre à jour un utilisateur existant
    // updateUser(id: number, userForm: UserForm): Observable<UserDTO> {
    //         return this.getUserById(id).pipe(
    //             switchMap((existingUser: UserDTO) => {
    //                 const newHistoriqueEntry: UserSalaires = {
    //                     date: userForm.date,
    //                     montant: userForm.montant,
    //                     regime: userForm.regime,
    //                 };
    //
    //                 const updatedHistorique = [
    //                     ...existingUser.historique,
    //                     newHistoriqueEntry,
    //                 ];
    //
    //                 const updatedUser: UserDTO = {
    //                     id: existingUser.id,
    //                     nom: userForm.nom,
    //                     prenom: userForm.prenom,
    //                     email: userForm.email,
    //                     isActive: userForm.isActive !== undefined ? userForm.isActive : existingUser.isActive,
    //                     roles: userForm.roles.map((roleId) => ({
    //                         idRole: roleId,
    //                         name: this.getRoleNameById(roleId),
    //                     })),
    //                     historique: updatedHistorique,
    //                 };
    //
    //                 console.log('Mise à jour de l\'utilisateur avec les données :', updatedUser);
    //
    //                 return this._http.put<UserDTO>(`${this.apiUrl}/users/${id}`, updatedUser);
    //             })
    //         );

    updateUser(id: number, userForm: UserForm): Observable<UserDTO> {
        // Mise à jour des informations de base de l'utilisateur
        const updatedUser = {
            nom: userForm.nom,
            prenom: userForm.prenom,
            email: userForm.email,
            isActive: userForm.isActive !== undefined ? userForm.isActive : true,
        };

        return this._http.put<UserDTO>(`${this.apiUrl}/User/${id}`, updatedUser).pipe(
            switchMap((user) => {
                // Mettre à jour les rôles
                return this.updateUserRoles(user.idUser, userForm.roles).pipe(
                    switchMap(() => {
                        // Ajouter un nouvel historique de salaire
                        const userSalaire = {
                            userId: user.idUser,
                            date: userForm.date,
                            regime: userForm.regime,
                            montant: userForm.montant,
                        };
                        return this._http.post(`${this.apiUrl}/UserSalaire`, userSalaire).pipe(
                            map(() => user)
                        );
                    })
                );
            })
        );
    }



    private updateUserRoles(userId: number, roles: number[]): Observable<any> {
        // Suppression des rôles existants
        return this._http.delete(`${this.apiUrl}/UserRole/${userId}`).pipe(
            switchMap(() => {
                // Ajout des nouveaux rôles
                const roleObservables = roles.map((roleId) => {
                    const userRole = {
                        userId: userId,
                        roleId: roleId,
                    };
                    return this._http.post(`${this.apiUrl}/UserRole`, userRole);
                });
                return forkJoin(roleObservables);
            })
        );
    }


    deactivateUser(id: number): Observable<UserDTO> {
        return this._http.put<UserDTO>(`${this.apiUrl}/User/${id}`, {
            isActive: false,
        });
    }


    // Méthode pour récupérer la liste des rôles
    getRoles(): Observable<Role[]> {
        return this._http.get<Role[]>(`${this.apiUrl}/Role`);
    }

    // Méthode pour obtenir le nom d'un rôle par son ID
    getRoleNameById(id: number): string {
        // Cette méthode devrait idéalement être asynchrone, mais pour simplifier,
        // nous supposons que nous avons les rôles en cache ou que nous utilisons une liste statique.
        const roles = [
            { idRole: 1, name: 'Admin' },
            { idRole: 2, name: 'Employé' },
        ];
        const role = roles.find((r) => r.idRole === id);
        return role ? role.name : '';
    }
}
