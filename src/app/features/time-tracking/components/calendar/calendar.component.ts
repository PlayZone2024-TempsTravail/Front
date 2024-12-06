import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { AppointmentService } from '../../../services/services-calendar.service';
import { Appointment, WorkTime, CompteurWorktimeCategory, Project } from '../../models/appointment.model';
import { AuthService } from '../../../auth/services/auth.services';
import { forkJoin, Observable } from 'rxjs';

export enum CalendarView {
  Month = 'month',
  Week = 'week',
  Day = 'day',
} 

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
}) 

export class CalendarComponent {
  viewDate: Date = new Date();
  weekDays: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  MonthDays: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  monthDays: Date[] = [];
  appointments: Appointment[] = [];
  currentView: CalendarView = CalendarView.Month;
  weeks: Date[][] = [];
  workTime: WorkTime[] = [];
  timeSlots: string[] = [];
  currentDate: number = new Date().getFullYear();
  CounterVA: any[] = [];
  ProjectList: any[] = [];
  public CalendarView = CalendarView;

  constructor(
    public dialog: MatDialog,
    public appointmentService: AppointmentService,
    private authService: AuthService
  ) {
    this.loadWorkTimeList();
    this.loadProjetList();
    this.generateView(this.currentView, this.viewDate);
    this.generateTimeSlots();
    this.loadCompteurWorktimeCategory();
  }

  getHourFromSlot(slot: string): number {
    return parseInt(slot.split(':')[0], 10);
  }

  private loadWorkTimeList(): void {
    this.appointmentService.getWorkTimeList().subscribe(
      (data: WorkTime[]) => {
        this.workTime = data; 
        this.loadAppointments();
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories de WorkTime:', error);
      }
    );
  }

  public loadCompteurWorktimeCategory(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.appointmentService.getCompteurWorktimeCategory(userId.toString()).subscribe(
        (data: CompteurWorktimeCategory[]) => {
          this.CounterVA = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des données CompteurWorktimeCategory:', error);
        }
      );
    }
  }

  private loadProjetList(): void {
    this.appointmentService.getProjet().subscribe(
      (data: Project[]) => {
        this.ProjectList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des données Project:', error);
      }
    );
  }  

  loadAppointments(): void {
    const userId = this.authService.getUserId();
    const { startDate, endDate } = this.getDateRange(this.currentView, this.viewDate);
    this.loadProjetList();

    this.appointmentService.getAppointments(userId!.toString(), startDate.toISOString(), endDate.toISOString()).subscribe({
      next: (appointments) => {
        if (appointments && appointments.length > 0) {
          this.appointments = appointments.map(appointment => {
            const endDate = new Date(appointment.end);
            endDate.setSeconds(endDate.getMinutes() + 1);

            return {
              ...appointment,
              date: new Date(appointment.start),
              start: appointment.start,
              end: endDate.toISOString(),
              workTime: this.workTime.find(wt => wt.idWorktimeCategory == appointment.categoryId)
            };
          });
        } else {
          console.error('Aucun rendez-vous trouvé');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des rendez-vous :', error);
      }
    });
  }  

  private getDateRange(view: CalendarView, date: Date): { startDate: Date, endDate: Date } {
    switch (view) {
      case CalendarView.Month:
        return this.getMonthRange(date);
      case CalendarView.Week:
        return this.getWeekRange(date);
      case CalendarView.Day:
        return this.getDayRange(date);
      default:
        return this.getMonthRange(date);
    }
  }
  
  private getMonthRange(date: Date): { startDate: Date, endDate: Date } {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    startDate.setDate(startDate.getDate() - 15);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endDate.setDate(endDate.getDate() + 15);
    return { startDate, endDate };
  }
  
  private getWeekRange(date: Date): { startDate: Date, endDate: Date } {
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay() - 7);
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + (6 - date.getDay()) + 7);
    return { startDate, endDate };
  }
  
  private getDayRange(date: Date): { startDate: Date, endDate: Date } {
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - 1);
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 1);
    return { startDate, endDate };
  }
  

  generateView(view: CalendarView, date: Date) {
    switch (view) {
      case CalendarView.Month:
        this.generateMonthView(date);
        break;
      case CalendarView.Week:
        this.generateWeekView(date);
        break;
      case CalendarView.Day:
        this.generateDayView(date);
        break;
      default:
        this.generateMonthView(date);
    }
    this.loadAppointments();
  }  

  generateMonthView(date: Date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.weeks = [];
    this.monthDays = [];
    let week: Date[] = [];

    for (let day = start.getDay(); day > 0; day--) {
      const prevDate = new Date(start);
      prevDate.setDate(start.getDate() - day);
      week.push(prevDate);
      this.monthDays.push(prevDate);
    }

    for (let day = 1; day <= end.getDate(); day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      this.monthDays.push(currentDate);
      week.push(currentDate);
      if (week.length === 7) {
        this.weeks.push(week);
        week = [];
      }
    }

    for (let day = 1; this.monthDays.length % 7 !== 0; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      this.monthDays.push(nextDate);
    }

    for (let day = 1; week.length < 7; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      week.push(nextDate);
    }

    if (week.length > 0) {
      this.weeks.push(week);
    }
  }

  generateWeekView(date: Date) {
    const startOfWeek = this.startOfWeek(date);
    this.monthDays = [];

    for (let day = 0; day < 7; day++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + day);
      this.monthDays.push(weekDate);
    }
  }

  generateDayView(date: Date) {
    this.monthDays = [date];
  }

  generateTimeSlots() {
    for (let hour = 0; hour <= 24; hour++) {
      const time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      this.timeSlots.push(time);
    }
  }

  switchToView(view: CalendarView) {
    this.currentView = view;
    this.generateView(this.currentView, this.viewDate);
  }

  startOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(start.setDate(diff));
  }

  previous() {
    if (this.currentView === 'month') {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() - 1)
      );
      this.generateMonthView(this.viewDate);
    } else if (this.currentView === 'week') {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() - 7)
      );
      this.generateWeekView(this.viewDate);
    } else {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() - 1)
      );
      this.generateDayView(this.viewDate);
    }
    this.loadAppointments();
  }

  next() {
    if (this.currentView === 'month') {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() + 1)
      );
      this.generateMonthView(this.viewDate);
    } else if (this.currentView === 'week') {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() + 7)
      );
      this.generateWeekView(this.viewDate);
    } else {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() + 1)
      );
      this.generateDayView(this.viewDate);
    }
    this.loadAppointments();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
    
  }

  isSameDate(date1: Date, date2: Date): boolean {
    if (!(date1 instanceof Date)) {
      date1 = new Date(date1);
    }

    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  selectDate(date?: Date, start?: string) {
    if (!date) {
      date = new Date();
    }
    this.openDialog({ date, start });
  }

  openDialog(appointment: any): void {

    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '500px',
      panelClass: 'dialog-container',
      data: {
        appointment,
        appointments: this.appointments
      },
    }); 

    dialogRef.afterClosed().subscribe(() => {
      this.loadCompteurWorktimeCategory()
      this.loadAppointments()
    });
  }

  getAppointmentsForDate(day: Date, timeSlots: string[]) {
    return this.appointments
      .filter((appointment) => {
        return this.isSameDate(appointment.date, day);
      })
      .map((appointment) => {
        const startTimeIndex = timeSlots.indexOf(this.appointmentService.convertTimeToString(this.todate(appointment.start)));
        const endTimeIndex = timeSlots.indexOf(this.appointmentService.convertTimeToString(this.todate(appointment.end)));
        return { ...appointment, startTimeIndex, endTimeIndex };
      });
  }

  viewToday(): void {
    this.viewDate = new Date();
    
    if (this.currentView === CalendarView.Month) {
      this.generateMonthView(this.viewDate);
      this.loadAppointments();
    }
    if (this.currentView === CalendarView.Week) {
      this.generateWeekView(this.viewDate);
      this.loadAppointments();
    }
    if (this.currentView === CalendarView.Day) {
      this.generateDayView(this.viewDate);
      this.loadAppointments();
    }
  }

  isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.viewDate.getMonth() &&
      date.getFullYear() === this.viewDate.getFullYear()
    );
  }

  getAppointmentsForDateTime(date: Date, timeSlot: string): Appointment[] {
    const timeSlotDate = this.appointmentService.convertStringToDate(date, timeSlot);
    return this.appointments.filter(
      (appointment) =>
        this.isSameDate(appointment.date, date) &&
        (
          (this.todate(appointment.start) <= timeSlotDate && this.todate(appointment.end) > timeSlotDate) ||
          (this.todate(appointment.start).getTime() === timeSlotDate.getTime())
        )
    );
  }

  editAppointment(appointment: Appointment, event: Event) {
    this.openDialog(appointment);
  }

  calculateDuration(start: string, end: string): number {
    
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes);

    const duration = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    return duration;
  }

  getTotalHours(): number {
    return this.appointments.reduce((total, appointment) => {
      const startTimeString = this.appointmentService.convertTimeToString(this.todate(appointment.start));
      const endTimeString = this.appointmentService.convertTimeToString(this.todate(appointment.end));
      const duration = this.calculateDuration(startTimeString, endTimeString);
      return total + duration;
    }, 0);
  }

  getColor(a: Appointment) {
    return "#" + this.workTime.find(wt => wt.idWorktimeCategory == a.categoryId)?.color;
  }

  updateDateHeader(): void {
    const currentYear = new Date().getFullYear();
    this.currentDate = currentYear;
  }

  todate(date: string) {
    return new Date(date)
  }
}