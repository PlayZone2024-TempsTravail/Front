import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Permission} from '../models/permission.model';
import {Role, RoleAddForm} from '../models/role.model';
import {RolePermission, RolePermissionUpdate} from '../models/rolepermission.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
    private apiUrl = 'http://api.technobel.pro:444/api';

    constructor(private _http: HttpClient) {}

    getListOfPermissions(): Observable<Permission[]> {
        return this._http.get<Permission[]>(`${this.apiUrl}/Permission`);
    }

    getListOfRoles(): Observable<Role[]> {
        return this._http.get<Role[]>(`${this.apiUrl}/Role`);
    }

    getListOfRolesPermissions(): Observable<RolePermission[]> {
        return this._http.get<RolePermission[]>(`${this.apiUrl}/RolePermission`);
    }

    updatePermissionRole(modification: RolePermissionUpdate): Observable<any> {
        return this._http.patch(`${this.apiUrl}/RolePermission`, modification);
    }

    newRole(role: RoleAddForm): Observable<Role> {
        return this._http.post<Role>(`${this.apiUrl}/Role`, role);
    }

    deleteRole(idRole: number): Observable<any> {
        return this._http.delete(`${this.apiUrl}/Role/${idRole}`);
    }
}
