import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
    selector: 'app-voir-graphique',
    templateUrl: './voir-graphique.component.html',
    styleUrls: ['./voir-graphique.component.scss']
})
export class ProjectGraphComponent implements OnInit {
    projects: Project | null = null; // déclaration de la variable projects
    expenses: any[] = [];
    incomes: any[] = [];
    ChartData: any;
    chartOptions: any;
    objective: number = 5000; // Set your objective limit here

    constructor(private readonly route: ActivatedRoute, private projectService: ProjectService) {}

    ngOnInit(): void {
        const projectId = this.route.snapshot.params['id'];

        this.projectService.getProjectById(projectId).subscribe((project) => {
            this.projects = project;

            // Generate random data for expenses and incomes
            this.expenses = Array.from({ length: 10 }, () => ({ amount: Math.floor(Math.random() * 1000) }));
            this.incomes = Array.from({ length: 10 }, () => ({ amount: Math.floor(Math.random() * 1000) }));

            this.ChartData = {
                labels: Array.from({ length: 10 }, (_, i) => `Point ${i + 1}`),
                datasets: [
                    {
                        label: 'Dépenses',
                        data: this.expenses.map(expense => expense.amount),
                        borderColor: '#FF6384',
                        fill: false
                    },
                    {
                        label: 'Revenus',
                        data: this.incomes.map(income => income.amount),
                        borderColor: '#36A2EB',
                        fill: false
                    },
                    {
                        label: 'Plafond',
                        data: Array(10).fill(this.objective),
                        borderColor: '#FFCE56',
                        borderDash: [5, 5],
                        fill: false
                    }
                ]
            };
            this.chartOptions = {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            };
        });
    }
}
