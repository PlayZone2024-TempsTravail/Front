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

//PRIMENG
import { DropdownModule } from 'primeng/dropdown';

export interface WorkTime {
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
export class AppointmentDialogComponent implements OnInit {
  messageErreurEdit: string | null = null;
  appointmentForm: FormGroup;
  WorkTime: WorkTime[] | undefined;
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
      color: string;
      appointments: Array<{
        uuid: string;
        date: Date;
        startTime: string;
        endTime: string;
      }>;
    },
    private formBuilder: FormBuilder
  ) {
    this.appointmentForm = this.formBuilder.group({
      WorkTime: [null, Validators.required], // Contrôle pour le dropdown
      date: [this.data.date, Validators.required],
      startTime: [this.data.startTime || '', Validators.required],
      endTime: [this.data.endTime || '', Validators.required],
      title: [''],
    }, { validators: this.timeRangeValidator });
    
    
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

  ngOnInit() {
    console.log('WorkTime data:', this.data.WorkTime);  // Vérifiez que la donnée est bien passée
  
    this.WorkTime = [
      { name: 'VIEC', color: '#FFDDC1' },
      { name: 'RC', color: '#A7D3F1' },
      { name: 'VA', color: '#C6EBCB' },
      { name: 'VAEX', color: '#FBCFE8' },
      { name: 'JF', color: '#F9C74F' },
      { name: 'MA', color: '#D9B9FF' },
      { name: 'CSS', color: '#F5B7B1' },
    ];
  
    if (this.data.WorkTime) {
      // Utilisez l'objet entier, pas seulement le nom
      const selectedWorkTime = this.WorkTime.find(workTime => workTime.name === this.data.WorkTime.name);
      this.appointmentForm.controls['WorkTime'].setValue(selectedWorkTime); // Définir l'objet entier
    } else {
      this.appointmentForm.controls['WorkTime'].setValue(null); // Initialiser pour la création
    }
  }
  

  onWorkTimeChange(event: any) {
    console.log('Selected WorkTime:', event.value);
  }


  get workTimeControl(): FormControl {
    return this.appointmentForm.get('WorkTime') as FormControl;
  }
}
