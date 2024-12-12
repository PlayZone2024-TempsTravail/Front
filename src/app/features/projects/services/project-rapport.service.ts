import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LebeleTree, ShortProject} from '../models/projectRapport.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectRapportService {

    private apiUrl = 'http://api.technobel.pro:444/api'  ; //attention changer quand vrai api'http://api.technobel.pro:444/api'
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
