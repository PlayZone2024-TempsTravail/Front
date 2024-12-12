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
import { WorkTime, Appointment, Project, ProjectList, UserList } from '../../models/appointment.model';

// PRIMENG
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AuthService } from '../../../auth/services/auth.services';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';

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

    // PRIMENG
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
  projects: Project[] = [];
  appointmentForm: FormGroup;
  projectForm: FormGroup;
  workTimeList: WorkTime[] = [];
  projectList: ProjectList[] = [];
  checkedIsOnSite: boolean = true;
  selectedUserId? : number;

  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      appointment: any,
      appointments: Appointment[],
      selectedUserId? : number
    },
    private appointmentService: AppointmentService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.appointments = data.appointments;
    this.selectedUserId = data.selectedUserId;

    this.projectForm = this.formBuilder.group({
      projectId: [null],
      projectName: [null],
      heures: [null],
    });

    this.appointmentForm = this.formBuilder.group({
      idWorktime: [],
      categoryId: [null, Validators.required],
      date: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      checkedIsOnSite: [],
      projectId: [null]
    }, { validators: this.timeRangeValidator });

    this.appointmentForm.patchValue({
      ...data.appointment,
      startTime: data.appointment.idWorktime
        ? this.appointmentService.convertTimeToString(new Date(data.appointment.start))
        : data.appointment.start,
      endTime: this.appointmentService.convertTimeToString(new Date(data.appointment.end)) || null,
      checkedIsOnSite: data.appointment.isOnSite === false,
    });

    if (data.appointment.projectId) {
      this.appointmentService.getProjetList().subscribe(
        (projects: ProjectList[]) => {
          const project = projects.find(p => p.idProject === data.appointment.projectId);
          if (project) {
            this.projectForm.patchValue({
              idProject: project.idProject,
              isActive: project.isActive,
              name: project.name
            });
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des données Project:', error);
        }
      );
    }
  }

  ngOnInit(): void {
    this.loadWorkTimeList();
    this.loadProjetList();

    this.appointmentForm.get('categoryId')?.valueChanges.subscribe(value => {
      this.appointmentForm.updateValueAndValidity();
    });
  }

  projectIdValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const categoryId = control.get('categoryId')?.value;
    const projectId = control.get('projectId')?.value;

    if (categoryId === 7 && !projectId) {
      return { projectIdRequired: true };
    }

    return null;
  };

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

  private loadProjetList(): void {
    this.appointmentService.getProjetList().subscribe(
      (data: ProjectList[]) => {
        this.projectList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des données Project:', error);
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

    endDate.setSeconds(endDate.getMilliseconds() - 1);

    console.log("TEST : ", this.selectedUserId);
    

    const appointment: Appointment = {
      idWorktime: formData.idWorktime,
      categoryId: formData.categoryId,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      isOnSite: formData.isOnSite,
      userId: this.selectedUserId ?? this.authService.getUserId() ?? 0,
      projectId: formData.projectId,
      date: date.toISOString(),
    };

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
    const idWorktime = control.get('idWorktime')?.value;

    if (startTime && endTime && date) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const startDate = new Date(date);
        startDate.setHours(startHour, startMinute);

        const endDate = new Date(date);
        endDate.setHours(endHour, endMinute);

        const tolerance = 1;
        const startDateWithTolerance = new Date(startDate.getTime() + tolerance * 60000);
        const endDateWithTolerance = new Date(endDate.getTime() - tolerance * 60000);

        if (startDate >= endDate) {
            return { timeRangeInvalid: true };
        }

        const hasOverlap = this.appointments.some((appt) => {
            if (idWorktime && appt.idWorktime === idWorktime) {
                return false;
            }

            const apptStart = new Date(appt.start);
            const apptEnd = new Date(appt.end);

            return (
                startDateWithTolerance < apptEnd &&
                endDateWithTolerance > apptStart
            );
        });

        if (hasOverlap) {
            return { timeRangeConflict: true };
        }
    }

    return null;
  };

  get workTimeControl(): FormControl {
    return this.appointmentForm.get('workTime') as FormControl;
  }
}
