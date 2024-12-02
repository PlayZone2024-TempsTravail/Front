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

    constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

    ngOnInit(): void {
        const projectId = this.route.snapshot.params['id'];

        // Charger les détails du projet
        this.projectService.getProjectById(projectId).subscribe((project) => {
            this.project = project;

            // Charger les dépenses liées au projet
            this.projectService.getProjectExpenses(projectId).subscribe((expenses) => {
                this.expenses = this.groupExpensesByLabel(expenses);

                // Calculate total expenses for each month
                this.calculateTotalExpenses();

                // Générer les données du graphique
                this.generateChartData();
            });
        });

        // Configurer les options du graphique
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
            const month = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });

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

    // Générer une plage de mois dynamique
    getMonthsRange(): string[] {
        if (!this.project) return [];

        const start = new Date(this.project.date_debut_projet);
        const today = new Date();
        const end = this.project.isActive ? today : new Date(this.project.date_fin_projet);

        const months = [];
        while (start <= end) {
            months.push(start.toLocaleString('default', { month: 'short', year: 'numeric' }));
            start.setMonth(start.getMonth() + 1);
        }

        return months;
    }

    // Générer les données du graphique
    generateChartData(): void {
        const months = this.getMonthsRange();

        const realExpenses: number[] = [];
        const predictedExpenses: number[] = [];
        let cumulativeReal = 0;
        let cumulativePredicted = 0;

        months.forEach((month) => {
            // Calculer les dépenses réelles et prévisionnelles
            const monthExpenses = this.expenses.map((e) => e.data[month] || 0);
            const totalReal = monthExpenses.reduce((sum, val) => sum + val, 0);
            const predicted = Math.random() * 500; // Simule une prévision pour cet exemple

            cumulativeReal += totalReal;
            cumulativePredicted += predicted;

            realExpenses.push(cumulativeReal);
            predictedExpenses.push(cumulativePredicted);
        });

        // Configurer les données pour le graphique
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
