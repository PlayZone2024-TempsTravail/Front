import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CreateDepenseDTO, DepenseDTO, LibeleDTO, OrganismeDTO, ProjectDTO} from '../models/depense.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepenseService {
    private apiUrl = 'http://api2.technobel.pro:444/api';

    constructor(private _http: HttpClient) {}

    // Récupération des dépenses d'un projet
    getDepensesByProjectId(projectId: number): Observable<DepenseDTO[]> {
        return this._http.get<DepenseDTO[]>(`${this.apiUrl}/Depense/projets/${projectId}`);
    }

    // Ajout d'une dépense
    addDepense(depense: CreateDepenseDTO): Observable<DepenseDTO> {
        return this._http.post<DepenseDTO>(`${this.apiUrl}/Depense`, depense);
    }

    // Récupération des libellés
    getLibeles(): Observable<LibeleDTO[]> {
        return this._http.get<LibeleDTO[]>(`${this.apiUrl}/Libele`);
    }

    // Récupération des organismes
    getOrganismes(): Observable<OrganismeDTO[]> {
        return this._http.get<OrganismeDTO[]>(`${this.apiUrl}/Organisme`);
    }
}
