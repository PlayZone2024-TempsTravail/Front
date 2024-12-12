import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppointmentService } from '../services/services-calendar.service';


@Component({
    selector: 'app-rapports',
    templateUrl: './rapports.component.html',
    styleUrls: ['./rapports.component.scss'],
})
export class RapportsComponent {
    form: FormGroup;

    constructor(private fb: FormBuilder, private rapportService: AppointmentService) {
        this.form = this.fb.group({
            dateDebutProjet: [''],
            dateFinProjet: [''],
        });
    }

    generateRapportTimes() {
        console.log(this.form.value);
        const startDate = this.form.value.dateDebutProjet;
        const endDate = this.form.value.dateFinProjet;

        if (startDate && endDate) {
            const payload = {
                start: startDate,
                end: endDate,
            };

            this.rapportService.createRapportTimes(payload).subscribe(
                (response) => {
                    const url = window.URL.createObjectURL(response);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'CounterRapport.pdf';
                    a.click();
                    window.URL.revokeObjectURL(url);
                    console.log('Report Generated:', response);

                },
                (error) => {
                    console.error('Error generating report:', error);

                }
            );
        } else {
            alert('Please select both start and end dates.');
        }
    }

    fetchRapportCounter() {
        this.rapportService.getRapportCounter().subscribe(
            (response) => {
                const url = window.URL.createObjectURL(response);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'CounterRapport.pdf';
                a.click();
                window.URL.revokeObjectURL(url);
                console.log('Report Generated:', response);

            },
            (error) => {
                console.error('Error generating report:', error);

            }
        );
    }
}


