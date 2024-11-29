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

//PRIMENG
import { DropdownModule } from 'primeng/dropdown';
import { WorkTime, Appointment } from '../../models/appointment.model';

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
    DropdownModule
  ],
})
export class AppointmentDialogComponent implements OnInit {
  appointments: Appointment[] = [];
  appointmentForm: FormGroup;
  workTimeList: WorkTime[] = [];

  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      appointment: any,
      appointments: Appointment[]
    },
    private appointmentService: AppointmentService,
    private formBuilder: FormBuilder
  ) {
    this.appointments = data.appointments;

    this.appointmentForm = this.formBuilder.group({
      id: [],
      WorkTime: [null, Validators.required],
      date: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
    }, { validators: this.timeRangeValidator });

    this.appointmentForm.patchValue(data.appointment);
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
    const selectedWorkTime = this.workTimeList.find(wt => wt.idWorktimeCategory === formData.WorkTime);
    if (selectedWorkTime) {
      formData.WorkTime = {
        abreviation: selectedWorkTime.abreviation,
        color: selectedWorkTime.color
      };
    }

    const appointment: Appointment = {
      ...formData,
      start: this.appointmentService.convertStringToDate(formData.date, formData.startTime),
      end: this.appointmentService.convertStringToDate(formData.date, formData.endTime),
    };

    if (appointment.id_WorkTime) {
      // Modifier l'appointment
      this.appointmentService.editAppointment(appointment).subscribe({
        next: () => {
          this.dialogRef.close();
        }
      });
    } else {
      // Ajouter un nouveau
      this.appointmentService.addAppointment(appointment).subscribe({
        next: () => {
          this.dialogRef.close();
        }
      });
    }
  }

  onDeleteClick(): void {
    this.appointmentService.deleteAppointment(this.appointmentForm.value.id).subscribe({
      next: () => this.dialogRef.close()
    });
  }

  timeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;
    const date = control.get('date')?.value;

    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);

      const startDate = new Date(date);
      startDate.setHours(startHours, startMinutes);

      const endDate = new Date(date);
      endDate.setHours(endHours, endMinutes);

      if (startDate >= endDate) {
        return { timeRangeInvalid: true };
      }

      if (
        this.appointments.some((appt) => {
          if (appt.category_Id === this.appointmentForm?.value.category_Id) return false;
          const [apptStartHours, apptStartMinutes] = this.appointmentService.convertTimeToString(appt.start).split(':').map(Number);
          const [apptEndHours, apptEndMinutes] = this.appointmentService.convertTimeToString(appt.end).split(':').map(Number);

          const apptStartDate = new Date(appt.date);
          apptStartDate.setHours(apptStartHours, apptStartMinutes);

          const apptEndDate = new Date(appt.date);
          apptEndDate.setHours(apptEndHours, apptEndMinutes);

          return startDate < apptEndDate && endDate > apptStartDate;
        })
      ) {
        return { timeRangeConflict: true };
      }
    }

    return null;
  };

  get workTimeControl(): FormControl {
    return this.appointmentForm.get('WorkTime') as FormControl;
  }
}
