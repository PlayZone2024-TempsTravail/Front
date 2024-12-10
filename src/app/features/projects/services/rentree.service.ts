import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RentreeDTO, RentreeCreateFormDTO } from '../models/rentree.model';
import {LibeleDTO, OrganismeDTO} from '../models/depense.model';


@Injectable({
    providedIn: 'root',
})
export class RentreeService {
    private apiUrl = 'http://api2.technobel.pro:444/api';

    constructor(private _http: HttpClient) {}

    /**
     * Récupère les rentrées d'un projet par son ID.
     * @param projectId - ID du projet.
     * @returns Observable<RentreeDTO[]> - Liste des rentrées associées au projet.
     */
    getRentreesByProjectId(projectId: number): Observable<RentreeDTO[]> {
        return this._http.get<RentreeDTO[]>(`${this.apiUrl}/Rentree/projet/${projectId}`);
    }

    /**
     * Ajoute une nouvelle rentrée pour un projet.
     * @param rentree - Objet contenant les informations de la rentrée.
     * @returns Observable<RentreeDTO> - La rentrée ajoutée.
     */
    addRentree(rentree: RentreeCreateFormDTO): Observable<RentreeDTO> {
        const rentreePayload = {
            ...rentree,
            dateFacturation: rentree.dateFacturation ? new Date(rentree.dateFacturation) : null,
        };

        return this._http.post<RentreeDTO>(`${this.apiUrl}/Rentree`, rentreePayload);
    }



    /**
     * Récupère la liste des libellés disponibles pour les dépenses.
     * @returns Observable<LibeleDTO[]> - Un observable contenant les libellés.
     */
    getLibeles(): Observable<LibeleDTO[]> {
        return this._http.get<LibeleDTO[]>(`${this.apiUrl}/Libele`);
    }

    /**
     * Récupère la liste des organismes liés aux projets.
     * @returns Observable<OrganismeDTO[]> - Un observable contenant les organismes.
     */
    getOrganismes(): Observable<OrganismeDTO[]> {
        return this._http.get<OrganismeDTO[]>(`${this.apiUrl}/Organisme`);
    }

    updateRentree(rentreeId: number, rentree: RentreeCreateFormDTO): Observable<RentreeDTO> {
        const rentreePayload = {
            ...rentree,
            dateFacturation: rentree.dateFacturation ? new Date(rentree.dateFacturation) : null
        };
        return this._http.put<RentreeDTO>(`${this.apiUrl}/Rentree/${rentreeId}`, rentreePayload);
    }
}
