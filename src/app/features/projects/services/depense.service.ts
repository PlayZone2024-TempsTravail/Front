import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    CreateDepenseDTO,
    DepenseDTO,
    LibeleDTO,
    OrganismeDTO,
    ProjectDTO,
    UpdateDepenseDTO
} from '../models/depense.model';
import { Observable } from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DepenseService {
    private apiUrl = environment.apiUrl;

    constructor(private _http: HttpClient) {}

    /**
     * Récupère toutes les dépenses liées à un projet spécifique.
     * @param projectId - ID du projet concerné.
     * @returns Observable<DepenseDTO[]> - Un observable contenant la liste des dépenses.
     */
    getDepensesByProjectId(projectId: number): Observable<DepenseDTO[]> {
        return this._http.get<DepenseDTO[]>(`${this.apiUrl}/Depense/projets/${projectId}`);
    }

    /**
     * Ajoute une nouvelle dépense au projet.
     * @param depense - Objet contenant les informations de la dépense.
     * @returns Observable<DepenseDTO> - Un observable avec la dépense ajoutée.
     */
    addDepense(depense: CreateDepenseDTO): Observable<DepenseDTO> {
        const depensePayload = {
            ...depense,
            organismeId: depense.organismeId ? depense.organismeId : 0, // null pas accepté donc on fout à 0
            dateIntervention: depense.dateIntervention ? new Date(depense.dateIntervention) : null,
            dateFacturation: new Date(depense.dateFacturation),
        };

        return this._http.post<DepenseDTO>(`${this.apiUrl}/Depense`, depensePayload);
    }

    /**
     * Modifie une dépense liée à un projet.
     * @param depenseId
     * @param depense
     */
    updateDepense(depenseId: number, depense: CreateDepenseDTO): Observable<DepenseDTO> {
        // On construit le payload avec idDepense et les champs nécessaires
        const depensePayload: UpdateDepenseDTO = {
            libeleId: depense.libeleId,
            categoryId: depense.categoryId,
            projectId: depense.projectId,
            organismeId: depense.organismeId,
            montant: depense.montant,
            dateIntervention: depense.dateIntervention ? new Date(depense.dateIntervention) : null,
            dateFacturation: depense.dateFacturation ? new Date(depense.dateFacturation) : null,
            motif: depense.motif,
        };
        console.log(depense.organismeId);

        // Appel sans l'ID dans l'URL
        return this._http.put<DepenseDTO>(`${this.apiUrl}/Depense?id=${depenseId}`, depensePayload);

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
}
