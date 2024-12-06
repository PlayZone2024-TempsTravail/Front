import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
    project: Project | null = null; // Détails du projet
    expenses: any[] = []; // Dépenses par libellé
    chartData: any; // Données du graphique
    chartOptions: any; // Options du graphique
    totalExpenses: { [month: string]: number } = {}; // Totals for each month
    expenseCategories: any[] = [];
    variation = 0; // Variation percentage

    constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

    ngOnInit(): void {
        const projectId = this.route.snapshot.params['id'];

        // Fetch project details
        this.projectService.getProjectById(projectId).subscribe((project) => {
            this.project = project;
/*
            // Fetch graph data
            this.projectService.getGraphData(projectId).subscribe((graphData) => {
                this.chartData = this.prepareChartData(graphData);
            });*/
/*
            // Fetch expenses for table
            this.projectService.getExpensesByCategory(projectId).subscribe((categories) => {
                this.expenseCategories = this.prepareExpenseCategories([]);
            });*/

            // Calculate variation after loading project details
            this.calculateVariation();
            });

        // Configure chart options
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
    }

    // Exporter le rapport PDF
    // Placeholder

    // Calculate variation percentage
    calculateVariation(): void {
        if (this.project && this.project.previsionDepenseActuelle > 0) {
            this.variation = ((this.project.depenseReelActuelle - this.project.previsionDepenseActuelle) / this.project.previsionDepenseActuelle) * 100;
        } else {
            this.variation = 0;
        }
    }
/*
    // Prepare categories for table display
    prepareExpenseCategories(categories: any[]): any[] {
        return categories
            .filter((category) => !category.isIncome) // Exclude income categories
            .map((category) => {
                const totals = this.calculateCategoryTotals(category.data);
                return { ...category, totals };
            });
    }
    */
/*
    // Calculate totals for a category
    calculateCategoryTotals(data: any[]): { [month: string]: number } {
        const totals: { [month: string]: number } = {};
        data.forEach((expense) => {
            Object.entries(expense.data).forEach(([month, value]: [string, number]) => {
                totals[month] = (totals[month] || 0) + value;
            });
        });
        return totals;
    } */

    // Prepare data for the graph
    prepareChartData(graphData: any): any {
        return {
            labels: graphData.date, // Array of dates from the API
            datasets: [
                {
                    label: 'Dépenses Réelles',
                    data: graphData.reel, // Array of actual expenses
                    borderColor: '#FF5733',
                    backgroundColor: 'rgba(255, 87, 51, 0.2)',
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Prévisions Dépenses',
                    data: graphData.prevision, // Array of predicted expenses
                    borderColor: '#33C3FF',
                    backgroundColor: 'rgba(51, 195, 255, 0.2)',
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
    }

    // Générer une plage de mois dynamique
    getMonthsRange(): string[] {
        if (!this.project) return [];

        const start = new Date(this.project.dateDebutProjet);
        const today = new Date();
        const end = this.project.isActive ? today : new Date(this.project.dateFinProjet);

        const months = [];
        while (start <= end) {
            months.push(start.toLocaleString('default', { month: 'short', year: 'numeric' }));
            start.setMonth(start.getMonth() + 1);
        }
        return months;
    }
}
