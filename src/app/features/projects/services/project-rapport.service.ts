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

    // postRapport(projectRapport: ProjectRapport): Observable<ProjectRapport> {
    //     const RapportToJson ={
    //         date_start: projectRapport.date_start,
    //         date_end: projectRapport.date_end,
    //         projectsRapportId : projectRapport.projectsRapportId,
    //         categories: projectRapport.categories,
    //         libelesId: projectRapport.libelesId,
    //     };
    //     return this._http.post<projectRapport>
    // }
}
