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
  workTime:WorkTime[]=[];
  timeSlots: string[] = [];
  public CalendarView = CalendarView;

  constructor(public dialog: MatDialog, private appointmentService: AppointmentService) { 
    this.workTime=this.appointmentService.getWorkTimeList()
    this.loadAppointments();
    this.generateView(this.currentView, this.viewDate); 
    this.generateTimeSlots(); 
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({ 
      next: (appointments) => { 
        if (appointments && appointments.length > 0) { 
          this.appointments = appointments; 
        } 
        else { 
          console.error('Not found'); 
        } 
      }, 
      error: (error) => { 
        console.error('erreur: ',error); 
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
    if (!(date1 instanceof Date)){
      date1 = new Date(date1)
    }
    
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  // créer un appointement
  selectDate(date?: Date, startTime?: string) {
    if (!date) {
      date = new Date()
    }
    this.openDialog({ date, startTime });
  }


  openDialog(appointment: any): void {
    // const hour = new Date().getHours();
    // const minutes = new Date().getMinutes();
    // const h = hour < 10 ? `0${hour}` : hour;
    // const m = minutes < 10 ? `00` : `00`;
  
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
        const startTimeIndex = timeSlots.indexOf(appointment.startTime);
        const endTimeIndex = timeSlots.indexOf(appointment.endTime);
        return { ...appointment, startTimeIndex, endTimeIndex };
      });
  }

  viewToday(): void {
    this.viewDate = new Date();
    if(this.currentView === CalendarView.Month) {
      this.generateMonthView(this.viewDate);
    }
    if(this.currentView === CalendarView.Week) {
      this.generateWeekView(this.viewDate);
    }
    if(this.currentView === CalendarView.Day) {
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
    return this.appointments.filter(
      (appointment) =>
        this.isSameDate(appointment.date, date) &&
        (
          (appointment.startTime <= timeSlot && appointment.endTime > timeSlot) ||
          (appointment.startTime === timeSlot) 
        )
    );
  }

  isOverlapping(date: Date, startTime: string, endTime: string, appointmentToSkip?: Appointment): boolean {
    return this.appointments.some((appointment) => {
      if (appointmentToSkip && appointment.id === appointmentToSkip.id) {
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
    this.openDialog(appointment);
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

  getColor(a:Appointment)
  {
      let color:string|undefined;
      if(a.WorkTime.color?.length == 0)
      {
        color= this.workTime.find(mapping => mapping.name == a.WorkTime.name)?.color;
      }
      else{
          color= a.WorkTime.color;
      }
      return color;
  }
}