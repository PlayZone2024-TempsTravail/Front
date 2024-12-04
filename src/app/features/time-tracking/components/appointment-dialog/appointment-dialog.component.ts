import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { AppointmentService } from '../../../services/services-calendar.service';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS, CustomDateAdapter } from '../../models/custom-date-adapter';
import { WorkTime, Appointment } from '../../models/appointment.model';

//PRIMENG
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AuthService } from '../../../auth/services/auth.services';

@Component({
  selector: 'app-appointment-dialog',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss'],
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule,

    //PRIMENG
    DropdownModule,
    InputSwitchModule
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
})

export class AppointmentDialogComponent implements OnInit {
  appointments: Appointment[] = [];
  appointmentForm: FormGroup;
  workTimeList: WorkTime[] = [];
  checkedIsOnSite: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      appointment: any,
      appointments: Appointment[],
    },
    private appointmentService: AppointmentService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.appointments = data.appointments;
  
    this.appointmentForm = this.formBuilder.group({
      idWorktime: [],
      categoryId: [null, Validators.required],
      date: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      checkedIsOnSite: [] 
    }, { validators: this.timeRangeValidator });
  
    //console.log(data.appointment)

    this.appointmentForm.patchValue({
      ...data.appointment,
      startTime: data.appointment.idWorktime 
        ? this.appointmentService.convertTimeToString(new Date(data.appointment.start)) 
        : data.appointment.start,

      endTime: this.appointmentService.convertTimeToString(new Date(data.appointment.end)) || null,
    });
  }

  ngOnInit(): void {
    this.loadWorkTimeList();
  }

  private loadWorkTimeList(): void {
    this.appointmentService.getWorkTimeList().subscribe(
      (data: WorkTime[]) => {
        this.workTimeList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories de WorkTime:', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (!this.appointmentForm.valid) {
      return;
    }
  
    const formData = this.appointmentForm.value;
    const selectedWorkTime = this.workTimeList.find(wt => wt.idWorktimeCategory === formData.workTime);
    if (selectedWorkTime) {
      formData.workTime = {
        abreviation: selectedWorkTime.abreviation,
        color: selectedWorkTime.color
      };
    }
  
    formData.isOnSite = !formData.checkedIsOnSite;

    const date = typeof formData.date === 'string' ? new Date(formData.date) : formData.date;
    const startDate = this.appointmentService.convertStringToDate(date, formData.startTime);
    const endDate = this.appointmentService.convertStringToDate(date, formData.endTime);

    const userId = this.authService.getUserId();

    if (userId === null) {
      console.error('User ID is null. Cannot save appointment.');
      return;
    }

    const appointment: Appointment = {
      idWorktime: formData.idWorktime,
      categoryId: formData.categoryId,
      start: startDate.toISOString(), 
      end: endDate.toISOString(),
      isOnSite: formData.isOnSite,
      userId: userId,
      projectId: 0,
      date: date.toISOString()
    };

    console.log('Data sent to API:', appointment);

    if (appointment.idWorktime) {
      this.appointmentService.editAppointment(appointment).subscribe({
        next: () => {          
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Error editing appointment:', err);
        }
      });
    } else {
      this.appointmentService.addAppointment(appointment).subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Error adding appointment:', err);
        }
      });
    }
  }

  onDeleteClick(): void {
    const formData = this.appointmentForm.value;

    const appointment: Appointment = {
      ...formData
    };

    if (appointment.idWorktime)
    this.appointmentService.deleteAppointment(appointment).subscribe({
      next: () => this.dialogRef.close()
    });
  }

  timeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;
    const date = control.get('date')?.value;
  
    if (startTime && endTime) {
  
      const startDate = new Date(date);
      startDate.setHours(startTime);
  
      const endDate = new Date(date);
      endDate.setHours(endTime);
  
      if (startDate >= endDate) {
        return { timeRangeInvalid: true };
      }
  
      if (
        this.appointments.some((appt) => {
          if (appt.categoryId === this.appointmentForm?.value.category_Id) return false;
          const apptStartDate = new Date(appt.date);
          const apptEndDate = new Date(appt.date);
  
          const [apptStartHours, apptStartMinutes] = appt.start.split(':').map(Number);
          const [apptEndHours, apptEndMinutes] = appt.end.split(':').map(Number);
  
          apptStartDate.setHours(apptStartHours, apptStartMinutes);
          apptEndDate.setHours(apptEndHours, apptEndMinutes);
  
          const tolerance = 1; 
          const startDateWithTolerance = new Date(startDate.getTime() + tolerance * 60000);
          const endDateWithTolerance = new Date(endDate.getTime() - tolerance * 60000);
  
          return startDateWithTolerance < apptEndDate && endDateWithTolerance > apptStartDate;
        })
      ) {
        return { timeRangeConflict: true };
      }
    }
  
    return null;
  };

  get workTimeControl(): FormControl {
    return this.appointmentForm.get('workTime') as FormControl;
  }
}
