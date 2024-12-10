import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Depense, Project, LibeleWithName} from '../models/project.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    private apiUrl = 'http://api2.technobel.pro:444/api'; //attention changer quand vrai api
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
                    isIncome: libele.isIncome,
                    idLibele: libele.idLibele,
                    idCategory: libele.idCategory,
                    libeleName: libele.libeleName,
                    categoryName : libele.categoryName,
                }))
            )
        );
    }

    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/Category`);
    }

    getPrevisionalIncomes(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/PrevisionRentree/${id}`);
    }

    getPrevisionalExpensesByCategory(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/PrevisionBudgetCategory/project/${id}`);
    }

    getPrevisionalExpensesByLibele(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/PrevisionBudgetLibele/project/${id}`);
    }

    addPrevisionIncome(income: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/PrevisionRentree`, income);
    }

    addPrevisionExpenseByCategory(expense: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/PrevisionBudgetCategory`, expense);
    }

    addPrevisionExpenseByLibele(expense: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/PrevisionBudgetLibele`, expense);
    }

    deletePrevisionIncome(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/PrevisionRentree/${id}`);
    }

    deletePrevisionExpenseByCategory(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/PrevisionBudgetCategory/${id}`);
    }

    deletePrevisionExpenseByLibele(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/PrevisionBudgetLibele/${id}`);
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
