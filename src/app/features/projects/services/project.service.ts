import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Depense, Project, LibeleWithName} from '../models/project.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    private apiUrl = 'http://api.technobel.pro:444/api'; //attention changer quand vrai api
    constructor(private http: HttpClient) { }

    getAllProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/Project/GetAll`);

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

    //getPrevisionalExpenses(id: number): Observable<any> {
    //    return this.http.get<any[]>(`${this.apiUrl}/PrevisionRentree/projets/${id}`);
    //}

    getExpensesByCategory(projectId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/expenses/categories/${projectId}`);
    }

    createProject(projectData: Project): Observable<Project> {
        return this.http.post<Project>(`${this.apiUrl}/Project`, projectData);
    }

    getLibeles(): Observable<LibeleWithName[]> {
        return this.http.get<any[]>(`${this.apiUrl}/Libele`).pipe(
            map((response) =>
                response.map((libele) => ({
                    idLibele: libele.idLibele, // Map API's idLibele to id_libele
                    idCategory: libele.idCategory, // Map API's idCategory to libele
                    name: libele.name,       // Map API's name to libele
                }))
            )
        );
    }

    getPrevisionalIncomes(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/PrevisionRentree/${id}`);
    }

    addPrevisionIncome(income: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/PrevisionRentree`, income);
    }

    deletePrevisionIncome(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/PrevisionRentree/${id}`);
    }

    getAllOrganismes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/organisme`);
    }
    addOrganisme(organismeData: { name: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/organisme`, organismeData);
    }
    getAllChargeProjet(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/User`);
    }
}
