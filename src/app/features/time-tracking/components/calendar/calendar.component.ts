import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AppointmentDialogComponent, WorkTime } from '../appointment-dialog/appointment-dialog.component';
import { AppointmentService, Appointment } from '../../../services/services-calendar.service';

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
  @Input() messageErreurEdit: string | null = null; 
  viewDate: Date = new Date(); 
  selectedDate: Date | null = null; 
  selectedStartTime: string | undefined; 
  weekDays: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']; 
  monthDays: Date[] = []; 
  appointments: Appointment[] = []; 
  currentView: CalendarView = CalendarView.Month; 
  timeSlots: string[] = []; 
  weeks: Date[][] = []; 
  public CalendarView = CalendarView;

  constructor(public dialog: MatDialog, private appointmentService: AppointmentService) { 
    this.appointmentService.getAppointments().subscribe({ 
      next: (appointments) => { 
        console.log('Appointments reçus:', appointments); 
        if (appointments && appointments.length > 0) { 
          this.appointments = appointments.map(appointment => ({ 
            ...appointment
          })); 
            console.log('Mapped Appointments:', this.appointments);
            console.log('Appointments chargé:', this.appointments); 
          } 
          else { 
            console.error('ne recois rien'); 
          } 
        }, 
        error: (error) => { 
          console.error('erreur: ',error); 
        } 
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
    if (!(date1 instanceof Date)){
      date1 = new Date(date1)
    }
    
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
    let d = new Date().getTime(); 
    let d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = Math.random() * 16; 
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
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
    WorkTime: WorkTime,
    startTime: string,
    endTime: string,
  ): { timeRangeConflict: boolean } {
    if (this.isOverlapping(date, startTime, endTime)) {
      return { timeRangeConflict: true };
    }
  
    this.appointments.push({
      uuid: this.generateUUID(),
      date,
      title: title || '',
      WorkTime,
      startTime,
      endTime,
      //color: this.getRandomColor(),
    });
  
    return { timeRangeConflict: false };
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
    const m = minutes < 10 ? `00` : `00`;
    
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '500px',
      panelClass: 'dialog-container',
      data: {
        uuid: '',
        date: this.selectedDate,
        title: '',
        WorkTime: '',
        startTime: this.selectedStartTime || `${h}:${m}`,
        endTime: this.selectedStartTime || `${h}:${m}`,
        //color: '',
        appointments: this.appointments,
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addAppointment(
          result.date,
          result.title,
          result.WorkTime,
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
    

    return this.appointments.filter(
      (appointment) =>
        this.isSameDate(appointment.date, date) &&
        (
          (appointment.startTime <= timeSlot && appointment.endTime > timeSlot) ||
          (appointment.startTime === timeSlot) 
        )
    );
  }
  
  // getRandomColor(): string { // TODO : Changer pour tableau de couleur 
  //   const r = Math.floor(Math.random() * 256);
  //   const g = Math.floor(Math.random() * 256);
  //   const b = Math.floor(Math.random() * 256);
  //   const a = 0.4;
  //   return `rgba(${r},${g},${b},${a})`;
  // }

  isOverlapping(date: Date, startTime: string, endTime: string, appointmentToSkip?: Appointment): boolean {
    return this.appointments.some((appointment) => {
      if (appointmentToSkip && appointment.uuid === appointmentToSkip.uuid) {
        return false;
      }
      
      if (!this.isSameDate(appointment.date, date)) {
        return false;
      }
  
      return (
        (startTime >= appointment.startTime && startTime < appointment.endTime) ||
        (endTime > appointment.startTime && endTime <= appointment.endTime) ||
        (startTime <= appointment.startTime && endTime >= appointment.endTime)
      );
    });
  }

  editAppointment(appointment: Appointment, event: Event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '500px',
      panelClass: 'dialog-container',
      data: {
        ...appointment,
        appointments: this.appointments,
      },
    });
  
    dialogRef.beforeClosed().subscribe((result) => {
      if (result) {
        const index = this.appointments.findIndex((a) => a.uuid === result.uuid);
        if (result.remove) {
          this.appointments.splice(index, 1);
        } else {
          const conflict = this.isOverlapping(
            result.date,
            result.startTime,
            result.endTime,
            appointment
          );
  
          if (conflict) {
            this.messageErreurEdit = 'Les horaires se chevauchent. Veuillez choisir un autre créneau.';
            return;
          }
  
          this.appointments[index] = result;
          this.messageErreurEdit = null; 
        }
      }
    });
  }  

  calculateDuration(startTime: string, endTime: string): number {
    const [startHours] = startTime.split(':').map(Number);
    const [endHours] = endTime.split(':').map(Number);
  
    if (endHours <= startHours) {
      return 1; 
    }
  
    const duration = endHours - startHours;
    return duration;
  }
  
  getTotalHours(): number {
    return this.appointments.reduce((total, appointment) => {
      const duration = this.calculateDuration(appointment.startTime, appointment.endTime);
      return total + duration;
    }, 0);
  }

  getColor(workTimeName: string): string {
    return this.appointmentService.getColor(workTimeName);
  }

}