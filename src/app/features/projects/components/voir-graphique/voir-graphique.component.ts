import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../../models/project.model';
import {ProjectService} from '../../services/project.service';

@Component({
    selector: 'app-voir-graphique',
    templateUrl: './voir-graphique.component.html',
    styleUrls: ['./voir-graphique.component.scss']
})
export class ProjectGraphComponent implements OnInit {

    constructor(private readonly route: ActivatedRoute, private projectService: ProjectService) {
    }
    expenses: any[] = [];
    previsualExpenses: any[] = [];
    incomes: any[] = [];
    previsualIncomes: any[] = [];
    chartData1: any;
    chartData2: any;
    chartOptions: any;
    objective: number = 5000; // Set your objective limit here

    ngOnInit(): void {
        const projectId = this.route.snapshot.params['id'];

        this.projectService.getProjectById(projectId).subscribe((project) => {
            this.projects = project;


            this.chartData1 = {
                labels: Array.from({length: 12}, (_, i) => `Point ${i + 1}`),
                datasets: [
                    {
                        label: 'Dépenses',
                        data: this.expenses.map(expense => expense.amount),
                        borderColor: '#FF6384',
                        fill: false,
                    },
                    {
                        label: 'Prévisions Dépenses',
                        data: this.previsualExpenses.map(income => income.amount),
                        borderColor: '#36A2EB',
                        fill: false,
                        borderDash: [5, 5],
                    },
                    {
                        label: 'Plafond',
                        data: Array(12).fill(this.objective),
                        borderColor: '#FFCE56',
                        borderDash: [5, 5],
                        fill: false
                    }
                ]
            };
            this.chartData2 = {
                labels: Array.from({length: 12}, (_, i) => `Point ${i + 1}`),
                datasets: [
                    {
                        label: 'Dépenses',
                        data: this.incomes.map(expense => expense.amount),
                        borderColor: '#FF6384',
                        fill: false,
                    },
                    {
                        label: 'Prévisions Dépenses',
                        data: this.previsualIncomes.map(income => income.amount),
                        borderColor: '#36A2EB',
                        fill: false,
                        borderDash: [5, 5],
                    },
                    {
                        label: 'Plafond',
                        data: Array(12).fill(this.objective),
                        borderColor: '#FFCE56',
                        borderDash: [5, 5],
                        fill: false
                    }
                ]
            };
            this.chartOptions = {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Dépenses : Réel / Prévision',
                    },
                },
            };
        });
    }
}
