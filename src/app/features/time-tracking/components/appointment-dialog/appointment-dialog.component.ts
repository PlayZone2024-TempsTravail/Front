import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
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
import { WorkTime, AppointmentService } from '../../../services/services-calendar.service';
import { HttpClient } from '@angular/common/http';

//PRIMENG
import { DropdownModule } from 'primeng/dropdown';

export interface WorkTimeCategory {
  name: string;
  color: `#${string}`;
}

@Component({
  selector: 'app-appointment-dialog',
  encapsulation:ViewEncapsulation.None,
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
export class AppointmentDialogComponent {
  messageErreurEdit: string | null = null;
  appointmentForm: FormGroup;
  WorkTime: WorkTime[] = [];
  selectedWorkTime: any | undefined;
  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      uuid: string;
      date: Date;
      title: string;
      WorkTime: WorkTime;
      startTime: string;
      endTime: string;
      //color: string;
      appointments: Array<{
        uuid: string;
        date: Date;
        startTime: string;
        endTime: string;
      }>;
    },
    private appointmentService: AppointmentService,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.appointmentForm = this.formBuilder.group({
      WorkTime: [null, Validators.required], // Contrôle pour le dropdown
      date: [this.data.date, Validators.required],
      startTime: [this.data.startTime || '', Validators.required],
      endTime: [this.data.endTime || '', Validators.required],
      title: [''],
    }, { validators: this.timeRangeValidator });
  }

  ngOnInit(): void {
    this.WorkTime = this.appointmentService.getWorkTimeList();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
      if (this.appointmentForm.valid) {
        const startTime = this.forceHoursOnly(this.appointmentForm.controls['startTime'].value);
        const endTime = this.forceHoursOnly(this.appointmentForm.controls['endTime'].value);

        const data = {
          WorkTime: this.appointmentForm.controls['WorkTime'].value,
          date: this.appointmentForm.controls['date'].value,
          startTime,
          endTime,
          uuid: this.data.uuid,
          title: this.appointmentForm.controls['title'].value || '',
        };
        this.dialogRef.close(data);
      }
  }

  // onSaveClick(): void {
  //   if (!this.appointmentForm.valid) {
  //     this.messageErreurEdit = 'Le formulaire contient des erreurs.';
  //     return;
  //   }
  //
  //   const appointmentFormData = this.appointmentForm.value;
  //
  //   this.http
  //     .post<{ success: boolean; message: string }>(
  //       `http://localhost:3000/appointments`,
  //       appointmentFormData
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         const startTime = this.forceHoursOnly(
  //           this.appointmentForm.controls['startTime'].value
  //         );
  //         const endTime = this.forceHoursOnly(
  //           this.appointmentForm.controls['endTime'].value
  //         );
  //
  //         const data = {
  //           WorkTime: this.appointmentForm.controls['WorkTime'].value,
  //           date: this.appointmentForm.controls['date'].value,
  //           startTime,
  //           endTime,
  //           uuid: this.data.uuid,
  //           title: this.appointmentForm.controls['title'].value || '',
  //         };
  //
  //         this.dialogRef.close(data);
  //       },
  //       error: (err) => {
  //         this.messageErreurEdit = 'Erreur lors de la sauvegarde. Veuillez réessayer.';
  //         console.error('Erreur :', err);
  //       },
  //     });
  // }


  private forceHoursOnly(time: string): string {
    const [hours] = time.split(':');
    return `${hours}:00`;
  }

  onDeleteClick(): void {
    this.dialogRef.close({ remove: true, uuid: this.data.uuid });
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

      if (startDate > endDate) {
        return { timeRangeInvalid: true };
      }

      if (
        this.data.appointments.some((appt) => {
          if (appt.uuid === this.data.uuid) return false;
          const [apptStartHours, apptStartMinutes] = appt.startTime.split(':').map(Number);
          const [apptEndHours, apptEndMinutes] = appt.endTime.split(':').map(Number);

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

  onWorkTimeChange(event: any) {
    console.log('Selected WorkTime:', event.value);
  }

  get workTimeControl(): FormControl {
    return this.appointmentForm.get('WorkTime') as FormControl;
  }
}


