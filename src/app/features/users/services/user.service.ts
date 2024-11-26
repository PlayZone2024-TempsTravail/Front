import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import { UserForm } from '../models/user.form.model';
import {User} from '../models/user.model';

@Injectable({
    providedIn: 'root',
})

export class UserService {
    private apiUrl = 'http://localhost:3000/users'; // TODO : changer avec la vraie API

    constructor(private _http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this._http.get<User[]>(this.apiUrl);
    }

    getUserById(id: number): Observable<User> {
        return this._http.get<User>(this.apiUrl + id);
    }

    addUser(user: UserForm): Observable<User> {
        return this._http.post<User>(this.apiUrl, user);
    }

    updateUser(id: number, user: UserForm): Observable<User> {
        return this._http.put<User>(this.apiUrl + id, user);
    }

    deleteUser(id: number): Observable<User> {
        return this._http.delete<User>(this.apiUrl + id);
    }
}
