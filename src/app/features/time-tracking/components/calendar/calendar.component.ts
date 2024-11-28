import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { AppointmentService } from '../../../services/services-calendar.service';
import { Appointment, WorkTime } from '../../models/appointment.model';

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
  weekDays: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  monthDays: Date[] = [];
  appointments: Appointment[] = [];
  currentView: CalendarView = CalendarView.Month;
  weeks: Date[][] = [];
  workTime: WorkTime[] = [];
  timeSlots: string[] = [];
  public CalendarView = CalendarView;

  constructor(public dialog: MatDialog, public appointmentService: AppointmentService) {
    this.loadWorkTimeList();
    this.loadAppointments();
    this.generateView(this.currentView, this.viewDate);
    this.generateTimeSlots();
  }

  private loadWorkTimeList(): void {
    this.appointmentService.getWorkTimeList().subscribe(
      (data: WorkTime[]) => {
        this.workTime = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories de WorkTime:', error);
      }
    );
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        if (appointments && appointments.length > 0) {
          this.appointments = appointments.map(appointment => ({
            ...appointment,
            start: this.appointmentService.convertStringToDate(appointment.date, this.appointmentService.convertTimeToString(appointment.start)),
            end: this.appointmentService.convertStringToDate(appointment.date, this.appointmentService.convertTimeToString(appointment.end)),
          }));
        } else {
          console.error('Not found');
        }
      },
      error: (error) => {
        console.error('erreur: ', error);
      }
    });
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
      this.appointmentService.getAppointments().subscribe(data => this.appointments = data);
    });
  }

  getAppointmentsForDate(day: Date, timeSlots: string[]) {
    return this.appointments
      .filter((appointment) => {
        return this.isSameDate(appointment.date, day);
      })
      .map((appointment) => {
        const startTimeIndex = timeSlots.indexOf(this.appointmentService.convertTimeToString(appointment.start));
        const endTimeIndex = timeSlots.indexOf(this.appointmentService.convertTimeToString(appointment.end));
        return { ...appointment, startTimeIndex, endTimeIndex };
      });
  }

  viewToday(): void {
    this.viewDate = new Date();
    if (this.currentView === CalendarView.Month) {
      this.generateMonthView(this.viewDate);
    }
    if (this.currentView === CalendarView.Week) {
      this.generateWeekView(this.viewDate);
    }
    if (this.currentView === CalendarView.Day) {
      this.generateDayView(this.viewDate);
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
          (appointment.start <= timeSlotDate && appointment.end > timeSlotDate) ||
          (appointment.start.getTime() === timeSlotDate.getTime())
        )
    );
  }

  isOverlapping(date: Date, start: string, end: string, appointmentToSkip?: Appointment): boolean {
    const startDate = this.appointmentService.convertStringToDate(date, start);
    const endDate = this.appointmentService.convertStringToDate(date, end);

    return this.appointments.some((appointment) => {
      if (appointmentToSkip && appointment.category_Id === appointmentToSkip.category_Id) {
        return false;
      }

      if (!this.isSameDate(appointment.date, date)) {
        return false;
      }

      return (
        (startDate >= appointment.start && startDate < appointment.end) ||
        (endDate > appointment.start && endDate <= appointment.end) ||
        (startDate <= appointment.start && endDate >= appointment.end)
      );
    });
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

    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // Convertir en heures
    return duration;
  }

  getTotalHours(): number {
    return this.appointments.reduce((total, appointment) => {
      const startTimeString = this.appointmentService.convertTimeToString(appointment.start);
      const endTimeString = this.appointmentService.convertTimeToString(appointment.end);
      const duration = this.calculateDuration(startTimeString, endTimeString);
      return total + duration;
    }, 0);
  }

  getColor(a: Appointment) {
    let color: string | undefined;
    if (a.WorkTime.color?.length == 0) {
      color = this.workTime.find(mapping => mapping.abreviation == a.WorkTime.abreviation)?.color;
    } else {
      color = a.WorkTime.color;
    }
    return color;
  }
}
