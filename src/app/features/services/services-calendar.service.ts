import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Appointment, WorkTime } from '../time-tracking/models/appointment.model';

@Injectable({
  providedIn: 'root',
})

export class AppointmentService {
  private appointmentsUrl = 'http://localhost:3000/appointments';

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<any>(this.appointmentsUrl).pipe(
      tap(data => 
        console.log('Data received:', data)),
      catchError(error => {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
        return throwError(error);
      })
    );
  }  

  addAppointment(a: Appointment) {
    return this.http.post(this.appointmentsUrl, a);
  }

  editAppointment(a: Appointment) {
    return this.http.put(this.appointmentsUrl + '/' + a.id, a);
  }

  getWorkTimeList(): WorkTime[] {
    return [
      { name: 'VIEC', color: '#FFDDC1' },
      { name: 'RC', color: '#A7D3F1' },
      { name: 'VA', color: '#C6EBCB' },
      { name: 'VAEX', color: '#FBCFE8' },
      { name: 'JF', color: '#F9C74F' },
      { name: 'MA', color: '#D9B9FF' },
      { name: 'CSS', color: '#F5B7B1' },
    ];
  }

  deleteAppointment(uuid: string): Observable<any> {
    return this.http.delete(`${this.appointmentsUrl}/${uuid}`);
  }
  
}