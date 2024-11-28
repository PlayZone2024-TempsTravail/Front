import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable, switchMap} from 'rxjs';
import {HistoriqueEntry, Role, UserDTO, UserForm} from '../models/user.dto.model';

@Injectable({
    providedIn: 'root',
})

export class UserService {
    // url de notre ficheir JSON (future API)
    private apiUrl = 'http://localhost:3000';

    // HttpClient pour effectuer les requêtes HTTP vers l'API (ici, le fichier JSON)
    constructor(private _http: HttpClient) {}

    // Méthode pour récupérer la liste des utilisateurs
    getUsers(): Observable<UserDTO[]> {
        // Requête HTTP GET pour obtenir tous les utilisateurs
        return this._http.get<UserDTO[]>(`${this.apiUrl}/users`);
    }

    // Méthode pour récupérer un utilisateur par son ID
    getUserById(id: number): Observable<UserDTO> {
        // Requête HTTP GET pour obtenir l'utilisateur avec l'ID donné
        return this._http.get<UserDTO>(`${this.apiUrl}/users/${id}`);
    }

    // Méthode pour ajouter un nouvel utilisateur
    addUser(userForm: UserForm): Observable<UserDTO> {
        const newUserDTO: Omit<UserDTO, 'idUser'> = {
            nom: userForm.nom,
            prenom: userForm.prenom,
            email: userForm.email,
            isActive: userForm.isActive !== undefined ? userForm.isActive : true,
            roles: userForm.roles.map((roleId) => ({
                idRole: roleId,
                name: this.getRoleNameById(roleId),
            })),
            historique: [
                {
                    date: userForm.date,
                    salaire: userForm.salaire,
                    regime: userForm.regime,
                },
            ],
        };
        return this._http.post<UserDTO>(`${this.apiUrl}/users`, newUserDTO);
        // const newUserDTO: UserDTO = {
        //     idUser: 0, // L'ID sera généré par le backend
        //     nom: userForm.nom,
        //     prenom: userForm.prenom,
        //     email: userForm.email,
        //     isActive: true,
        //     roles: userForm.roles.map((roleId) => ({
        //         idRole: roleId,
        //         name: this.getRoleNameById(roleId),
        //     })),
        //     historique: [
        //         {
        //             date: userForm.date,
        //             salaire: userForm.salaire,
        //             regime: userForm.regime,
        //         },
        //     ],
        // };
        // return this._http.post<UserDTO>(`${this.apiUrl}/users`, newUserDTO);
    }

    // Méthode pour mettre à jour un utilisateur existant
    updateUser(id: number, userForm: UserForm): Observable<UserDTO> {
        // // Récupérer l'utilisateur existant avec getUserById pour  obtenir les informations actuelles de l'utilisateur
        // // le pipe permet de chaîner les opérations
        // return this.getUserById(id).pipe(
        //     //switchMap permet de prendre le résultat d'un Observable (getUserById(id)) et de le transformer en un nouvel Observable (this._http.put(...)).
        //     // nécessaire car on utilise une opération asynchrone (récupérer l'utilisateur) avant d'en effectuer une autre (mettre à jour l'utilisateur).
        //     switchMap((existingUser: UserDTO) => {
        //         // Créer une nouvelle entrée d'historique avec les données du formulaire
        //         const newHistoriqueEntry: HistoriqueEntry = {
        //             date: userForm.date,
        //             salaire: userForm.salaire,
        //             regime: userForm.regime,
        //         };
        //
        //         // Combiner l'historique existant avec la nouvelle entrée récupérée du formulaire
        //         const updatedHistorique = [
        //             // opérateur de décomposition ... pour créer un nouveau tableau qui contient toutes les entrées de l'historique existant + la nouvelle entrée
        //             ...existingUser.historique, // Historique existant
        //             newHistoriqueEntry, // nouvelle entrée
        //         ];
        //
        //         // Construire l'objet utilisateur mis à jour
        //         // Partial indique que toutes les propriétés sont optionnelles. On ne met pas à jour toutes les propriétés, seulement certaines
        //         const updatedUser: Partial<UserDTO> = {
        //             nom: userForm.nom,
        //             prenom: userForm.prenom,
        //             email: userForm.email,
        //             roles: userForm.roles.map((roleId) => ({ // le map ici permet de transformer les idRole en objets Role
        //                 idRole: roleId,
        //                 name: this.getRoleNameById(roleId), // appel de la méthode pour obtenir le nom du rôle
        //             })),
        //             historique: updatedHistorique,
        //             isActive: userForm.isActive !== undefined ? userForm.isActive : existingUser.isActive,
        //         };
        //
        //         // Envoyer la requête PUT pour mettre à jour l'utilisateur
        //         return this._http.put<UserDTO>(`${this.apiUrl}/users/${id}`, updatedUser);
        //     })
        // );
            return this.getUserById(id).pipe(
                switchMap((existingUser: UserDTO) => {
                    const newHistoriqueEntry: HistoriqueEntry = {
                        date: userForm.date,
                        salaire: userForm.salaire,
                        regime: userForm.regime,
                    };

                    const updatedHistorique = [
                        ...existingUser.historique,
                        newHistoriqueEntry,
                    ];

                    const updatedUser: UserDTO = {
                        idUser: existingUser.idUser,
                        nom: userForm.nom,
                        prenom: userForm.prenom,
                        email: userForm.email,
                        isActive: userForm.isActive !== undefined ? userForm.isActive : existingUser.isActive,
                        roles: userForm.roles.map((roleId) => ({
                            idRole: roleId,
                            name: this.getRoleNameById(roleId),
                        })),
                        historique: updatedHistorique,
                    };

                    console.log('Mise à jour de l\'utilisateur avec les données :', updatedUser);

                    return this._http.put<UserDTO>(`${this.apiUrl}/users/${id}`, updatedUser);
                })
            );



    }

    // Méthode pour désactiver un utilisateur (mettre 'isActive' à false)
    deactivateUser(id: number): Observable<UserDTO> {
        // Requête HTTP PATCH pour mettre à jour partiellement l'utilisateur
        return this._http.patch<UserDTO>(`${this.apiUrl}/users/${id}`, {
            isActive: false,
        });
    }

    // Méthode pour récupérer la liste des rôles
    getRoles(): Observable<Role[]> {
        // Requête HTTP GET pour obtenir tous les rôles
        return this._http.get<Role[]>(`${this.apiUrl}/roles`);
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
