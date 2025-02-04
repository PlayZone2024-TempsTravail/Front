import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category, ConfigurationList} from '../models/configuration.model';
import {Observable} from 'rxjs';
import {ConfigurationAbsence, ConfigurationAbsenceWithOutId} from '../models/configurationAbsence.model';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    private apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getConfiguration(): Observable<ConfigurationList[]> {
        return this.http.get<ConfigurationList[]>(`${this.apiUrl}/Configuration`)
    }

    postConfiguration(data: ConfigurationList): Observable<ConfigurationList> {
        return this.http.post<ConfigurationList>(`${this.apiUrl}/Configuration`, data)
    }

    getCategory(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/Category`)
    }

    // modif absence

    getWorktimeCategory(): Observable<ConfigurationAbsence[]> {
        return this.http.get<ConfigurationAbsence[]>(`${this.apiUrl}/WorktimeCategory`)
    }

    postWorktimeCategory(data: ConfigurationAbsenceWithOutId) {
        return this.http.post<ConfigurationAbsenceWithOutId>(`${this.apiUrl}/WorktimeCategory`, data)
    }

    putWorktimeCategory(data: ConfigurationAbsenceWithOutId, id: number) {
        return this.http.put<ConfigurationAbsenceWithOutId>(`${this.apiUrl}/WorktimeCategory/${id}`, data)
    }

}
