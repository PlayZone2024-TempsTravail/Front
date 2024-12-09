import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import {Project, Category, LibelleExpenses, InOut} from '../../models/project.model';

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
    project: Project | null = null; // Project details
    expenseCategories: Category[] = []; // Processed categories with expense data
    overallTotals: { [month: string]: number } = {}; // Overall totals for all categories
    chartData: any; // Data for the graph
    chartOptions: any; // Options for the graph
    variation = 0; // Variation percentage

    constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

    ngOnInit(): void {
        const projectId = this.route.snapshot.params['id'];

        // Fetch project details
        this.projectService.getProjectById(projectId).subscribe((project) => {
            this.project = project;

            // Fetch graph data
            this.projectService.getGraphData(projectId).subscribe((graphData) => {
                this.chartData = this.prepareChartData(graphData);
            });

            // Fetch expense data
            this.projectService.getExpensesByCategory(projectId).subscribe((categories: Category[]) => {
                this.expenseCategories = this.prepareExpenseCategories(categories);
                this.overallTotals = this.calculateOverallTotals();
            });

            // Calculate variation
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

    // Calculate variation percentage
    calculateVariation(): void {
        if (this.project && this.project.previsionDepenseActuelle > 0) {
            this.variation = ((this.project.depenseReelActuelle - this.project.previsionDepenseActuelle) / this.project.previsionDepenseActuelle) * 100;
        } else {
            this.variation = 0;
        }
    }

    // Prepare categories for table display
    prepareExpenseCategories(categories: Category[]): Category[] {
        return categories
            .map((category) => {
                const libelleData =
                    category.libelles?.map((libelle: LibelleExpenses) => ({
                        libelle: libelle.name,
                        data: this.mapMonthlyData(libelle.inOuts || []),
                    })) || [];

                const totals = this.calculateCategoryTotals(libelleData);

                return { ...category, data: libelleData, totals: totals || {} }; // Ensure totals is an object
            });
    }

    // Map inOuts data to monthly totals
    mapMonthlyData(inOuts: InOut[]): { [month: string]: number } {
        const monthlyData: { [month: string]: number } = {};
        inOuts.forEach((entry) => {
            // Parse the MM-YYYY format
            const [monthStr, yearStr] = entry.date.split('-');
            const year = parseInt(yearStr, 10);
            const monthIndex = parseInt(monthStr, 10) - 1; // zero-based month index

            // Create a valid Date object (e.g., December 2024)
            const dateObj = new Date(year, monthIndex, 1);

            // Convert to a standard key format (e.g., "Dec 2024")
            const monthKey = dateObj.toLocaleString('default', { month: 'numeric', year: 'numeric' });

            // Aggregate the amount
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + entry.montant;
        });
        return monthlyData;
    }

    // Calculate totals for a category
    calculateCategoryTotals(data: { libelle: string; data: { [month: string]: number } }[]): { [month: string]: number } {
        const totals: { [month: string]: number } = {};
        data.forEach((expense) => {
            Object.entries(expense.data).forEach(([month, value]) => {
                totals[month] = (totals[month] || 0) + value;
            });
        });
        return totals;
    }

    // Calculate overall totals across all categories
    calculateOverallTotals(): { [month: string]: number } {
        const overallTotals: { [month: string]: number } = {};
        this.expenseCategories.forEach((category) => {
            if (category.totals) {
                Object.entries(category.totals).forEach(([month, value]) => {
                    overallTotals[month] = (overallTotals[month] || 0) + value;
                });
            }
        });
        return overallTotals;
    }

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

    // Generate a dynamic range of months
    getMonthsRange(): string[] {
        if (!this.project) return [];

        const start = new Date(this.project.dateDebutProjet);
        const today = new Date();
        const end = this.project.isActive ? today : new Date(this.project.dateFinProjet);

        const months = [];
        while (start <= end) {
            months.push(start.toLocaleString('default', { month: 'numeric', year: 'numeric' }));
            start.setMonth(start.getMonth() + 1);
        }
        return months;
    }

    protected readonly Object = Object;
}
