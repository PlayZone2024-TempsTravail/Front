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

    private apiUrl = 'http://api.technobel.pro:444/api'; // URL to web api
    constructor(private http: HttpClient) { }

    getProjectById(id: number): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/Project/idproject/${id}`);
    }
    getProjectExpenses(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/Depense/projets/${id}`);
    }
    getProjectIncomes(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/Rentree/${id}`);
    }
    getPrevisionalIncomes(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/PrevisionRentree/projets/${id}`);
    }


    //getPrevisionalExpenses(id: number): Observable<any> {
    //    return this.http.get<any[]>(`${this.apiUrl}/PrevisionRentree/projets/${id}`);
    //}



}
