import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LebeleTree, ShortProject} from '../models/projectRapport.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectRapportService {

    private apiUrl = environment.apiUrl  ; //attention changer quand vrai api
    constructor(private _http: HttpClient) { }

    getShortProject(): Observable<ShortProject[]> {
        return this._http.get<ShortProject[]>(`${this.apiUrl}/Project/short`);
    }

    getLibele(): Observable<LebeleTree[]>{
        return this._http.get<LebeleTree[]>(`${this.apiUrl}/Libele/tree`);
    }

    createProjetRapport(rapport: any): Observable<Blob> {
        return this._http.post(`${this.apiUrl}/Rapport/project`, rapport, { responseType: 'blob' });
    }
}
