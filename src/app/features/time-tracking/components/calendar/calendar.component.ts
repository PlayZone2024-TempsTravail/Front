import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';

interface Appointment {
  uuid?: string;
  date: Date;
  title: string;
  startTime: string;
  endTime: string;
  color?: string;
}

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
  selectedDate: Date | null = null;
  selectedStartTime: string | undefined;
  weekDays: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  monthDays: Date[] = [];
  appointments: Appointment[] = [
    // {
    //   uuid: '00000000-0000-0000-0000-000000000001',
    //   date: new Date(
    //     new Date().getFullYear(),
    //     new Date().getMonth(),
    //     new Date().getDate()
    //   ),
    //   title: 'Meeting with Bob',
    //   startTime: '09:00',
    //   endTime: '10:00',
    // },
  ];
  currentView: CalendarView = CalendarView.Month;
  timeSlots: string[] = [];

  weeks: Date[][] = [];

  public CalendarView = CalendarView;

  constructor(public dialog: MatDialog) {
    this.appointments.forEach((appointment) => {
      appointment.color = this.getRandomColor();
    });
    this.generateView(this.currentView, this.viewDate);
    this.generateTimeSlots();
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

  isSelected(date: Date): boolean {
    if (!this.selectedDate) {
      return false;
    }
    return (
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  selectDate(date?: Date, startTime?: string) {
    if (date) {
      this.selectedDate = date;
    } else {
      this.selectedDate = new Date();
    }
    this.selectedStartTime = startTime;
    this.openDialog();
  }

  generateUUID(): string {
    let d = new Date().getTime(); //Timestamp
    let d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  addAppointment(
    date: Date,
    title: string,
    startTime: string,
    endTime: string
  ) {
    this.appointments.push({
      uuid: this.generateUUID(),
      date,
      title,
      startTime,
      endTime,
      color: this.getRandomColor(),
    });
  }

  deleteAppointment(appointment: Appointment, event: Event) {
    event.stopPropagation();
    const index = this.appointments.indexOf(appointment);
    if (index > -1) {
      this.appointments.splice(index, 1);
    }
  }

  openDialog(): void {
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes();
    const h = hour < 10 ? `0${hour}` : hour;
    const m = minutes < 10 ? `0` : minutes;
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '500px',
      panelClass: 'dialog-container',
      data: {
        date: this.selectedDate,
        title: '',
        startTime: this.selectedStartTime || `${h}:${m}`,
        endTime: this.selectedStartTime || `${h}:${m}`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addAppointment(
          result.date,
          result.title,
          result.startTime,
          result.endTime
        );
      }
    });
  }

  getAppointmentsForDate(day: Date, timeSlots: string[]) {
    return this.appointments
      .filter((appointment) => {
        return this.isSameDate(appointment.date, day);
      })
      .map((appointment) => {
        const startTimeIndex = timeSlots.indexOf(appointment.startTime);
        const endTimeIndex = timeSlots.indexOf(appointment.endTime);
        return { ...appointment, startTimeIndex, endTimeIndex };
      });
  }

  drop(event: CdkDragDrop<Appointment[]>, date: Date, slot?: string) {
    const movedAppointment = event.item.data;
    movedAppointment.date = date;
    if (slot) {
      movedAppointment.startTime = slot;
      movedAppointment.endTime = slot;
    }
  }

  viewToday(): void {
    this.viewDate = new Date();
    this.generateMonthView(this.viewDate);
  }

  isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.viewDate.getMonth() &&
      date.getFullYear() === this.viewDate.getFullYear()
    );
  }

  getAppointmentsForDateTime(date: Date, timeSlot: string): Appointment[] {
    const appointmentsForDateTime: Appointment[] = this.appointments.filter(
      (appointment) =>
        this.isSameDate(appointment.date, date) &&
        appointment.startTime <= timeSlot &&
        appointment.endTime >= timeSlot
    );

    return appointmentsForDateTime;
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.4;
    return `rgba(${r},${g},${b},${a})`;
  }

  editAppointment(appointment: Appointment, event: Event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '500px',
      panelClass: 'dialog-container',
      data: appointment,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.appointments.findIndex(
          (appointment) => appointment.uuid === result.uuid
        );
        if (result.remove) {
          this.appointments.splice(index, 1);
        } else {
          this.appointments[index] = result;
        }
      }
    });
  }
}
