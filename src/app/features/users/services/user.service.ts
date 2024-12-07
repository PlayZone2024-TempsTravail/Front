import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap, of } from 'rxjs';
import { UserSalaire, UserRole, UserDTO, UserForm, Role } from '../models/user.dto.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://api2.technobel.pro:444/api';

    constructor(private _http: HttpClient) {}

    getUsers(): Observable<UserDTO[]> {
        return this._http.get<UserDTO[]>(`${this.apiUrl}/User`);
    }

    getUserById(id: number): Observable<UserDTO> {
        return this._http.get<UserDTO>(`${this.apiUrl}/User/id/${id}`);
    }

    addUser(userForm: UserForm): Observable<UserDTO> {
        const newUser = {
            nom: userForm.nom,
            prenom: userForm.prenom,
            email: userForm.email,
            password: userForm.password || 'password',
            isActive: userForm.isActive !== undefined ? userForm.isActive : true,
        };

        return this._http.post<UserDTO>(`${this.apiUrl}/User`, newUser).pipe(
            switchMap((createdUser) => {
                const rolesReq = userForm.roles.map((roleId) =>
                    this._http.post(`${this.apiUrl}/UserRole`, { userId: createdUser.idUser, roleId })
                );

                const userSalaire = {
                    userId: createdUser.idUser,
                    date: userForm.date,
                    regime: userForm.regime,
                    montant: userForm.montant,
                };
                const salaireReq = this._http.post(`${this.apiUrl}/UserSalaire`, userSalaire);

                return forkJoin([...rolesReq, salaireReq]).pipe(
                    map(() => createdUser)
                );
            })
        );
    }

    addUserRole(userId: number, roleId: number): Observable<any> {
        return this._http.post(`${this.apiUrl}/UserRole`, { userId, roleId });
    }

    removeUserRole(userId: number, roleId: number): Observable<any> {
        const body = { userId, roleId };
        return this._http.request('delete', `${this.apiUrl}/UserRole`, { body });
    }

    updateUserRoles(userId: number, newRoles: number[]): Observable<any> {
        return this.getUserById(userId).pipe(
            switchMap((user) => {
                const existingRoles = user.userRoles.map(r => r.roleId);
                const rolesToRemove = existingRoles.filter(r => !newRoles.includes(r));
                const rolesToAdd = newRoles.filter(r => !existingRoles.includes(r));

                const deleteRequests = rolesToRemove.map(roleId => this.removeUserRole(userId, roleId));
                const addRequests = rolesToAdd.map(roleId => this.addUserRole(userId, roleId));

                return forkJoin(deleteRequests.length > 0 ? deleteRequests : of(null)).pipe(
                    switchMap(() => {
                        return addRequests.length > 0 ? forkJoin(addRequests) : of(null);
                    })
                );
            })
        );
    }

    addUserSalaire(userId: number, date: string, regime: number, montant: number): Observable<any> {
        return this._http.post(`${this.apiUrl}/UserSalaire`, { userId, date, regime, montant });
    }

    getRoles(): Observable<Role[]> {
        return this._http.get<Role[]>(`${this.apiUrl}/Role`);
    }

    getRoleNameById(roleId: number): string {
        const roles = [
            { idRole: 1, name: 'Employe' },
            { idRole: 2, name: 'Charge de Projet' },
            { idRole: 3, name: 'Admin' },
        ];
        const role = roles.find(r => r.idRole === roleId);
        return role ? role.name : '';
    }

    // Méthode pour faire un PUT complet du user (nom, prenom, email, isActive)
    // On récupère la dernière version de l'utilisateur pour avoir les roles et salaires à jour.
    updateUserFull(userId: number, userForm: UserForm): Observable<UserDTO> {
        return this.getUserById(userId).pipe(
            switchMap(existingUser => {
                const updatedUser: UserDTO = {
                    idUser: existingUser.idUser,
                    nom: userForm.nom ?? existingUser.nom,
                    prenom: userForm.prenom ?? existingUser.prenom,
                    email: userForm.email ?? existingUser.email,
                    isActive: userForm.isActive ?? existingUser.isActive,
                    userRoles: existingUser.userRoles.map(r => ({
                        roleId: r.roleId,
                        userId: r.userId,
                        roleName: r.roleName || this.getRoleNameById(r.roleId)
                    })),
                    userSalaires: existingUser.userSalaires.map(s => ({
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
}
