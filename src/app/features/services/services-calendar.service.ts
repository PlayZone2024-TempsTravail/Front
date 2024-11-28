import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Appointment, WorkTime } from '../time-tracking/models/appointment.model';
import { formatISO } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointmentsUrlJSON = ''; //http://localhost:3000/appointments
  private workTimeCategoryUrl = 'https://api.technobel.pro/api/WorktimeCategory';
  private workTimeAddUrl = 'https://api.technobel.pro/api/Worktime';

  private readonly jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIyMDI0LTExLTI4VDEwOjQyOjAyLjkwOTMwMTFaIiwibm9tIjoiSGFuc2UiLCJwcmVub20iOiJTdGV2ZW4iLCJlbWFpbCI6InN0ZXZlbkB0ZWNoLmJlIiwiUGVybWlzc2lvbnMiOlsiQUpPVVRFUl9QT0lOVEFHRSIsIkFKT1VURVJfUk9MRSIsIkFKT1VURVJfVVNFUiIsIkRFQlVHX1BFUk1JU1NJT04iLCJNT0RJRklFUl9QT0lOVEFHRSIsIk1PRElGSUVSX1JPTEUiLCJNT0RJRklFUl9VU0VSIiwiU1VQUFJJTUVSX1BPSU5UQUdFIiwiU1VQUFJJTUVSX1JPTEUiLCJTVVBQUklNRVJfVVNFUiIsIlZPSVJfQUxMX1BPSU5UQUdFUyIsIlZPSVJfUE9JTlRBR0UiLCJWT0lSX1JPTEVTIiwiVk9JUl9VU0VSUyJdLCJleHAiOjE3MzI3OTA1MjIsImlzcyI6IkFQSV9JRUMiLCJhdWQiOiJGUk9OVF9JRUMifQ.ut6lG9Vx_XXkcBoJVrScB87xWTKZXMds31oBiFG_AkE";

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<any>(this.appointmentsUrlJSON).pipe(
      tap(data => console.log('Data received:', data)),
      catchError(error => {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
        return throwError(error);
      })
    );
  }

  addAppointment(a: Appointment) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);

    const startTime = this.convertTimeToString(a.start); 
    const endTime = this.convertTimeToString(a.end);  

    const startDate = this.mergeDateAndTime(a.date, startTime);  
    const endDate = this.mergeDateAndTime(a.date, endTime);  

    const body = {
      start: formatISO(startDate),  
      end: formatISO(endDate),  
      isOnSite: true, // TODO : A changer
      categoryId: a.WorkTime.idWorktimeCategory,
      projectId: 1010, // TODO : A changer
      userId: 101, // TODO : A changer
    };

    console.log('Data being sent:', body);

    return this.http.post(this.workTimeAddUrl, body, { headers });
  }

  editAppointment(a: Appointment) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);
    return this.http.put(this.appointmentsUrlJSON + '/' + a.id_WorkTime, a, { headers });
  }

  deleteAppointment(uuid: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);
    return this.http.delete(`${this.appointmentsUrlJSON}/${uuid}`, { headers });
  }

  getWorkTimeList(): Observable<WorkTime[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);
    return this.http.get<WorkTime[]>(this.workTimeCategoryUrl, { headers });
  }

  public convertTimeToString(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  public convertStringToDate(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const resultDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0, 0);
    return resultDate;
  }

  public mergeDateAndTime(date: Date, time: string): Date {
    return this.convertStringToDate(date, time);
  }
}
