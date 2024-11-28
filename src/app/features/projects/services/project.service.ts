import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Project} from '../models/project.model';
import {map } from 'rxjs/operators';
import {organisme} from '../models/organisme.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    private apiUrl = 'http://localhost:3000'; //attention changer quand vrai api
    constructor(private http: HttpClient) { }

    getAllProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/projects`);

    }
    getProjectById(id: number): Observable<Project> {
        return this.http.get<Project[]>(`${this.apiUrl}/projects?id_project=${id}`).pipe(
            map((projects) => projects[0]) // Récupère le premier élément du tableau
        );
    }
    getProjectExpenses(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/expenses?id_project=${id}`);
    }
    getProjectIncomes(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/incomes?id_project=${id}`);
    }


}
