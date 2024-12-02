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
    totalPrevisions = 0; // Total previsions
    totalCost = 0; // Total cost (real expenses)
    variation = 0; // Variation percentage

    constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

    ngOnInit(): void {
        const projectId = this.route.snapshot.params['id'];

        // Fetch project details
        this.projectService.getProjectById(projectId).subscribe((project) => {
            this.project = project;

            // Fetch expenses and calculate totals
            this.projectService.getProjectExpenses(projectId).subscribe((expenses) => {
                this.expenses = this.groupExpensesByLabel(expenses);
                this.calculateTotalExpenses();
                this.totalCost = this.calculateTotalCost();
                this.calculateVariation();

                // Generate chart data
                this.generateChartData();
            });

            // Fetch previsions
            this.projectService.getProjectPrevisions(projectId).subscribe((previsions) => {
                this.totalPrevisions = this.calculateTotalPrevisions(previsions);
                this.calculateVariation();
            });
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

    // Regrouper les dépenses par libellé et par mois
    groupExpensesByLabel(expenses: any[]): any[] {
        const grouped: { [key: string]: any } = {};

        expenses.forEach((expense) => {
            const month = new Date(expense.dateIntervention).toLocaleString('default', { month: 'short', year: 'numeric' });

            if (!grouped[expense.libelle]) {
                grouped[expense.libelle] = { libelle: expense.libelle, data: {} };
            }

            grouped[expense.libelle].data[month] = (grouped[expense.libelle].data[month] || 0) + expense.montant;
        });

        return Object.values(grouped);
    }

    // Calculate total expenses for each month
    calculateTotalExpenses(): void {
        const months = this.getMonthsRange();
        this.totalExpenses = {};

        months.forEach((month) => {
            let total = 0;
            this.expenses.forEach((expense) => {
                total += expense.data[month] || 0;
            });
            this.totalExpenses[month] = total;
        });
    }

    // Calculate total cost (real expenses)
    calculateTotalCost(): number {
        return Object.values(this.totalExpenses).reduce((sum, value) => sum + value, 0);
    }

    // Calculate total previsions
    calculateTotalPrevisions(previsions: any[]): number {
        return previsions.reduce((sum, prevision) => sum + prevision.montant, 0);
    }

    // Calculate variation percentage
    calculateVariation(): void {
        if (this.totalPrevisions > 0) {
            this.variation = ((this.totalCost - this.totalPrevisions) / this.totalPrevisions) * 100;
        }
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

    // Generate chart data
    generateChartData(): void {
        const months = this.getMonthsRange();

        const realExpenses: number[] = [];
        const predictedExpenses: number[] = [];
        let cumulativeReal = 0;
        let cumulativePredicted = 0;

        months.forEach((month) => {
            // Calculate real and predicted expenses
            const monthExpenses = this.expenses.map((e) => e.data[month] || 0);
            const totalReal = monthExpenses.reduce((sum, val) => sum + val, 0);
            const predicted = Math.random() * 500; // Simulate a prediction for demonstration

            cumulativeReal += totalReal;
            cumulativePredicted += predicted;

            realExpenses.push(cumulativeReal);
            predictedExpenses.push(cumulativePredicted);
        });

        // Set chart data
        this.chartData = {
            labels: months,
            datasets: [
                {
                    label: 'Dépenses Réelles',
                    data: realExpenses,
                    borderColor: '#FF5733',
                    backgroundColor: 'rgba(255, 87, 51, 0.2)',
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Prévisions Dépenses',
                    data: predictedExpenses,
                    borderColor: '#33C3FF',
                    backgroundColor: 'rgba(51, 195, 255, 0.2)',
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
    }
}
