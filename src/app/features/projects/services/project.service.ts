import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Depense, Project} from '../models/project.model';
import {UserInMisson} from '../models/userProject.model';
import {User} from '../../users/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    private apiUrl = 'http://localhost:3000'; //attention changer quand vrai api
    constructor(private http: HttpClient) { }

    getAllProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/projects`);

    }


    getUserInMissonById(id: number): Observable<UserInMisson[]> {
        return this.http.get<UserInMisson[]>(`${this.apiUrl}/users/${id}`);
    }

    getAllUsers(): Observable<UserInMisson[]> {
        return this.http.get<UserInMisson[]>(`${this.apiUrl}/users`);
    }



}
