import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DepenseDTO, LibeleDTO, ProjectDTO} from '../models/depense.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepenseService {
    private apiUrl = 'http://localhost:3000'; // URL du json-server pour le moment

    constructor(private _http: HttpClient) {}

    // Récupérer les dépenses d'un projet
    // Récupérer les dépenses d'un projet
    getDepensesByProjectId(projectId: number): Observable<DepenseDTO[]> {
        return this._http.get<DepenseDTO[]>(`${this.apiUrl}/depenses?projectId=${projectId}`);
    }

    // Ajouter une nouvelle dépense
    addDepense(depense: DepenseDTO): Observable<DepenseDTO> {
        return this._http.post<DepenseDTO>(`${this.apiUrl}/depenses`, depense);
    }

    // Mettre à jour une dépense existante
    updateDepense(depense: DepenseDTO): Observable<DepenseDTO> {
        return this._http.put<DepenseDTO>(`${this.apiUrl}/depenses/${depense.idDepense}`, depense);
    }

    // Supprimer une dépense
    deleteDepense(idDepense: number): Observable<void> {
        return this._http.delete<void>(`${this.apiUrl}/depenses/${idDepense}`);
    }

    // Récupérer tous les libellés
    getLibeles(): Observable<LibeleDTO[]> {
        return this._http.get<LibeleDTO[]>(`${this.apiUrl}/libeles`);
    }
}
