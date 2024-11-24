import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserForm } from '../models/user.form.model';

@Injectable({
    providedIn: 'root',
})

export class UserService {
    private apiUrl = 'https://blablabla.com/api/users'; // Remplace avec ton URL

    constructor(private _http: HttpClient) {}

    // TODO : a faire avec les ifnos de l'API (pour le moment tout est en dur)

    createUser(user: UserForm): Observable<any> {
        return this._http.post(this.apiUrl, user);
    }

    /*
    updateUser(id: number, user: UserForm): Observable<any> {
        return this._http.put(`${this.apiUrl}/${id}`, user);
    }
    */
}
