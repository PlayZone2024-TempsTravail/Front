import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Appointment {
  uuid?: string;
  date: Date; 
  title: string;
  startTime: string;
  endTime: string;
  color?: string;
  WorkTime: WorkTime;
}

export interface WorkTime {
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})

export class AppointmentService {

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<any>(`http://localhost:3000/appointments`).pipe(
      tap(data => 
        console.log('Data received:', data)),
      catchError(error => {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
        return throwError(error);
      })
    );
  }  

  private workTimeList: WorkTime[] = [
    { name: 'VIEC', color: '#FFDDC1' },
    { name: 'RC', color: '#A7D3F1' },
    { name: 'VA', color: '#C6EBCB' },
    { name: 'VAEX', color: '#FBCFE8' },
    { name: 'JF', color: '#F9C74F' },
    { name: 'MA', color: '#D9B9FF' },
    { name: 'CSS', color: '#F5B7B1' },
  ];

  getColor(name: string): string {
    const workTime = this.workTimeList.find(wt => wt.name === name);
    return workTime ? workTime.color : '#FFFFFF';
  }
}