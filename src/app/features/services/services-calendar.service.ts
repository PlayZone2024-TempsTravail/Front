import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Appointment, WorkTime, CompteurWorktimeCategory } from '../time-tracking/models/appointment.model';
import { AuthService  } from '../../features/auth/services/auth.services';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointmentsUrlJSON = ''; //http://localhost:3000/appointments
  private workTimeCategoryUrl = 'http://api2.technobel.pro:444/api/WorktimeCategory';
  private workTimeUrl = 'http://api2.technobel.pro:444/api/Worktime';
  private workTimeRangeUrl = 'http://api2.technobel.pro:444/api/Worktime/range';
  private compteurWorktimeCategoryUrl = 'http://api2.technobel.pro:444/api/Counter/absence/';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  addAppointment(a: Appointment) {

    const startTime = this.convertTimeToString(new Date(a.start));
    const endTime = this.convertTimeToString(new Date(a.end));

    const startDate = this.mergeDateAndTime(a.date, startTime);
    const endDate = this.mergeDateAndTime(a.date, endTime);

    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('Impossible de récupérer "userId" dans le token JWT.');
      return throwError(() => new Error('Invalid token'));
    }

    const body = {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      isOnSite: a.isOnSite,
      categoryId: a.categoryId,
      projectId: a.projectId,
      userId: +userId,
    };

    return this.http.post(this.workTimeUrl, body).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'ajout du rendez-vous:', error);
        return throwError(() => error);
      })
    );
  }

  editAppointment(a: Appointment) {
    console.log("id worktime : " + a.idWorktime);
    
    return this.http.put(`${this.workTimeUrl}/${a.idWorktime}`, a);
  }

  deleteAppointment(a: Appointment): Observable<any> {
    return this.http.delete(`${this.workTimeUrl}/${a.idWorktime}`);
  }

  getWorkTimeList(): Observable<WorkTime[]> {
    return this.http.get<WorkTime[]>(this.workTimeCategoryUrl);
  }

  //getProjetList(): Observable<>

  getAppointments(userId: string, startDate: string, endDate: string): Observable<Appointment[]> {
    const params = {
      userId: userId,
      startDate: startDate,
      endDate: endDate
    };
    return this.http.get<Appointment[]>(this.workTimeRangeUrl, { params });
  }

  public convertTimeToString(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  public convertStringToDate(date: Date | string, time: string): Date {
    // Si 'date' est une chaîne, convertir en objet Date
    if (typeof date === 'string') {
      date = new Date(date);
    }
  
    // Vérifier si 'date' est un objet Date valide
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid date object");
    }
  
    const [hours, minutes] = time.split(':').map(Number); 
    
    // Créer un nouvel objet Date avec l'année, mois, jour et heure/mn de la date passée
    const resultDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0, 0);
    return resultDate;
  }

  public mergeDateAndTime(date: Date, time: string): Date {
    return this.convertStringToDate(date, time);
  }

  getCompteurWorktimeCategory(userId: string): Observable<CompteurWorktimeCategory[]> {
    const url = `${this.compteurWorktimeCategoryUrl}/${userId}`;

    return this.http.get<CompteurWorktimeCategory[]>(url).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données CompteurWorktimeCategory:', error);
        return throwError(() => error);
      })
    );
  }
}
