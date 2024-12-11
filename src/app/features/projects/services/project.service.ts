import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Depense, Project} from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    private apiUrl = 'http://api.technobel.pro:444/api'; //attention changer quand vrai api
    constructor(private http: HttpClient) { }

    getAllProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/Project`);

    }

    getProjectById(id: number): Observable<Project> {
        return this.http.get<Project>(`${this.apiUrl}/Project/idproject/${id}`);
    }

    getProjectExpenses(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/Project/idproject/${id}`);
    }

    getProjectPrevisions(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/Project/idproject/${id}`);
    }

    getPrevisionalIncomes(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/PrevisionRentree/projets/${id}`);
    }

    //getPrevisionalExpenses(id: number): Observable<any> {
    //    return this.http.get<any[]>(`${this.apiUrl}/PrevisionRentree/projets/${id}`);
    //}

    getExpensesByCategory(id: number): Observable<any> {
        return this.http.get<Project>(`${this.apiUrl}/Project/data/output/${id}`);
    }

    getGraphData(projectId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/Project/graphique/depense/${projectId}`);
    }
}
