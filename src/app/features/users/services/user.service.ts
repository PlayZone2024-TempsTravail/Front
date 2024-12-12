import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap, of } from 'rxjs';
import { UserSalaire, UserRole, UserDTO, UserForm, Role } from '../models/user.dto.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    public apiUrl = 'http://api.technobel.pro:444/api';

    constructor(private _http: HttpClient) {}

    /**
     * Récupère la liste de tous les utilisateurs.
     * @returns Observable<UserDTO[]> - Un observable contenant la liste des utilisateurs.
     */
    getUsers(): Observable<UserDTO[]> {
        return this._http.get<UserDTO[]>(`${this.apiUrl}/User`);
    }

    /**
     * Récupère les informations d'un utilisateur spécifique par son ID.
     * @param id - ID de l'utilisateur à récupérer.
     * @returns Observable<UserDTO> - Un observable contenant les données de l'utilisateur.
     */
    getUserById(id: number): Observable<UserDTO> {
        return this._http.get<UserDTO>(`${this.apiUrl}/User/id/${id}`);
    }

    /**
     * Ajoute un nouvel utilisateur à la base de données.
     * @param userForm - Les données du formulaire utilisateur.
     * @returns Observable<UserDTO> - Un observable avec les informations de l'utilisateur créé.
     * Le processus inclut la création de l'utilisateur, l'ajout de ses rôles et de son salaire.
     */
    addUser(userForm: UserForm): Observable<UserDTO> {
        const newUser = {
            nom: userForm.nom,
            prenom: userForm.prenom,
            email: userForm.email,
            password: userForm.password || 'password', // Mot de passe par défaut si non fourni (pour les tests)
            isActive: userForm.isActive !== null ? userForm.isActive : true,  // Actif par défaut
        };

        console.log(newUser)
        return this._http.post<UserDTO>(`${this.apiUrl}/User`, newUser).pipe(
            switchMap((createdUser) => {  // Une fois l'utilisateur créé, on ajoute ses rôles et salaire
                const rolesReq = userForm.roles.map((roleId) =>
                    this._http.post(`${this.apiUrl}/UserRole`, { userId: createdUser.idUser, roleId }) // Ajout des rôles
                );

                const userSalaire = {  // Création de l'objet salaire
                    userId: createdUser.idUser,
                    date: new Date(userForm.date),
                    regime: userForm.regime,
                    montant: userForm.montant,
                };
                const salaireReq = this._http.post(`${this.apiUrl}/UserSalaire`, userSalaire); // Requête pour le salaire

                return forkJoin([...rolesReq, salaireReq]).pipe( // Exécute les requêtes en parallèle
                    map(() => createdUser) // Retourne l'utilisateur créé une fois les opérations terminées
                );
            })
        );
    }

    /**
     * Ajoute un rôle à un utilisateur existant.
     * @param userId - ID de l'utilisateur.
     * @param roleId - ID du rôle à ajouter.
     * @returns Observable<any> - Un observable de la requête HTTP.
     */
    addUserRole(userId: number, roleId: number): Observable<any> {
        return this._http.post(`${this.apiUrl}/UserRole`, { userId, roleId });
    }

    /**
     * Met à jour un utilisateur existant avec toutes ses données.
     * Cela inclut les champs de base (nom, email, etc.), ainsi que les rôles et salaires associés.
     * @param userId - ID de l'utilisateur à mettre à jour.
     * @param userForm - Données du formulaire utilisateur.
     * @returns Observable<UserDTO> - Un observable avec les données de l'utilisateur mis à jour.
     */
    updateUserFull(userId: number, userForm: UserForm): Observable<UserDTO> {
        return this.getUserById(userId).pipe( // Récupère les données de l'utilisateur existant
            switchMap(existingUser => {
                const updatedUser: UserDTO = {
                    idUser: existingUser.idUser, // conserve les données existantes pour les champs non modifiés
                    nom: userForm.nom ?? existingUser.nom,
                    prenom: userForm.prenom ?? existingUser.prenom,
                    email: userForm.email ?? existingUser.email,
                    isActive: userForm.isActive ?? existingUser.isActive,
                    userRoles: existingUser.userRoles.map(r => ({ // idem pur les infos des rôles
                        roleId: r.roleId,
                        userId: r.userId,
                        roleName: r.roleName || this.getRoleNameById(r.roleId)
                    })),
                    userSalaires: existingUser.userSalaires.map(s => ({ // idem pour les infos des salaires
                        idUserSalaire: s.userId,
                        userId: s.userId,
                        date: s.date,
                        regime: s.regime,
                        montant: s.montant
                    }))
                };

                return this._http.put<UserDTO>(`${this.apiUrl}/User/${userId}`, updatedUser);
            })
        );
    }

    /**
     * Supprime un rôle d'un utilisateur existant.
     * @param userId - ID de l'utilisateur.
     * @param roleId - ID du rôle à supprimer.
     * @returns Observable<any> - Un observable de la requête HTTP.
     */
    removeUserRole(userId: number, roleId: number): Observable<any> {
        const body = { userId, roleId };
        return this._http.request('delete', `${this.apiUrl}/UserRole`, { body });
    }

    /**
     * Met à jour les rôles d'un utilisateur en comparant les rôles existants avec les nouveaux.
     * Ajoute les nouveaux rôles et supprime les anciens rôles qui ne sont plus valides.
     * @param userId - ID de l'utilisateur.
     * @param newRoles - Liste des ID de rôles à attribuer.
     * @returns Observable<any> - Un observable de la requête HTTP.
     */
    updateUserRoles(userId: number, newRoles: number[]): Observable<any> {
        return this.getUserById(userId).pipe(
            switchMap((user) => {
                const existingRoles = user.userRoles.map(r => r.roleId); // Rôles actuels de l'utilisateur
                const rolesToRemove = existingRoles.filter(r => !newRoles.includes(r)); // Roles à supprimer
                const rolesToAdd = newRoles.filter(r => !existingRoles.includes(r)); // Nouveaux rôles à ajouter

                const deleteRequests = rolesToRemove.map(roleId => this.removeUserRole(userId, roleId));
                const addRequests = rolesToAdd.map(roleId => this.addUserRole(userId, roleId));

                return forkJoin(deleteRequests.length > 0 ? deleteRequests : of(null)).pipe( // Supprime les anciens rôles de l'user
                    switchMap(() => {
                        return addRequests.length > 0 ? forkJoin(addRequests) : of(null); // Ajoute les nouveaux rôles de l'user
                    })
                );
            })
        );
    }

    /**
     * Ajoute un salaire à un utilisateur existant.
     * @param userId - ID de l'utilisateur.
     * @param date - Date d'attribution du salaire.
     * @param regime - Régime de l'utilisateur.
     * @param montant - Montant du salaire.
     * @returns Observable<any> - Un observable de la requête HTTP.
     */
    addUserSalaire(userId: number, date: Date, regime: number, montant: number): Observable<any> {
        return this._http.post(`${this.apiUrl}/UserSalaire`, { userId, date, regime, montant });
    }

    /**
     * Récupère la liste de tous les rôles disponibles.
     * @returns Observable<Role[]> - Un observable contenant la liste des rôles.
     */
    getRoles(): Observable<Role[]> {
        return this._http.get<Role[]>(`${this.apiUrl}/Role`);
    }

    /**
     * Retourne le nom d'un rôle à partir de son ID.
     * @param roleId - ID du rôle.
     * @returns string - Nom du rôle ou une chaîne vide si le rôle n'existe pas.
     */
    getRoleNameById(roleId: number): string {
        const roles = [
            { idRole: 1, name: 'Employe', isRemovable: true, isVisible: true },
            { idRole: 2, name: 'Chargés de projet', isRemovable: true, isVisible: false },
            { idRole: 3, name: 'Admin', isRemovable: false, isVisible: true },
        ];
        const role = roles.find(r => r.idRole === roleId);
        return role ? role.name : '';
    }

    /**
     * Méthode pour réinitialiser le mot de passe d'un utilisateur.
     * @param userId ID de l'utilisateur
     */
    resetUserPassword(userId: number): Observable<any> {
        return this._http.put(`${this.apiUrl}/User/resetpassword/${userId}`, {});
    }

    /**
     * Récupère la liste des rôles visibles.
     */
    getVisibleRoles(): Observable<Role[]> {
        return this.getRoles().pipe(
            map(roles => roles.filter(role => role.isVisible))
        );
    }
}
