// MODIFICATION ICI (NOUVEAU FICHIER)
// Service permettant la gestion des compteurs (CompteurWorktimeCategory)

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompteurWorktimeCategoryDTO, CompteurWorktimeCategoryUpdateDTO, CompteurWorktimeCategoryDeleteDTO, WorktimeCategoryDTO } from '../models/compteur.model';

@Injectable({
    providedIn: 'root',
})
export class CompteurWorktimeCategoryService {
    private apiUrl = 'http://api.technobel.pro:444/api';

    constructor(private _http: HttpClient) {}

    /**
     * Récupère les compteurs d'un utilisateur.
     * @param userId
     */
    getCompteursByUserId(userId: number): Observable<CompteurWorktimeCategoryDTO[]> {
        return this._http.get<CompteurWorktimeCategoryDTO[]>(`${this.apiUrl}/CompteurWorktimeCategory/${userId}`);
    }

    /**
     * Ajoute un compteur pour un utilisateur.
     * @param compteur
     */
    addCompteur(compteur: CompteurWorktimeCategoryDTO): Observable<CompteurWorktimeCategoryDTO> {
        return this._http.post<CompteurWorktimeCategoryDTO>(`${this.apiUrl}/CompteurWorktimeCategory`, compteur);
    }

    /**
     * Met à jour un compteur pour un utilisateur.
     * @param userId
     * @param update
     */
    updateCompteur(userId: number, update: CompteurWorktimeCategoryUpdateDTO): Observable<any> {
        return this._http.put(`${this.apiUrl}/CompteurWorktimeCategory/${userId}`, update);
    }

    /**
     * Supprime un compteur pour un utilisateur.
     * @param deleteDTO
     */
    deleteCompteur(deleteDTO: CompteurWorktimeCategoryDeleteDTO): Observable<any> {
        return this._http.request('delete', `${this.apiUrl}/CompteurWorktimeCategory`, { body: deleteDTO });
    }

    /**
     * Récupère les catégories de Worktime.
     */
    getWorktimeCategories(): Observable<WorktimeCategoryDTO[]> {
        return this._http.get<WorktimeCategoryDTO[]>(`${this.apiUrl}/WorktimeCategory`);
    }
}
