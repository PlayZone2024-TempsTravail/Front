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

    project: Project | null = null; // Détails du projet
    chartDataExpenses: any;
    chartDataIncomes: any;
    chartOptions: any;
    lastPrevisionIncome: number = 0;
    lastRealIncome: number = 0;
    lastPrevisionExpense: number = 0;
    lastRealExpense: number = 0;
    variationIncomes: number = 0;
    variationExpenses: number = 0;

    constructor(
        private readonly route: ActivatedRoute,
        private projectService: ProjectService
    ) {}

    ngOnInit(): void {
        const projectId = this.route.snapshot.params['id'];

        this.projectService.getProjectById(projectId).subscribe((project) => {
            this.project = project;

            this.projectService.getGraphDataExpenses(projectId).subscribe((graphDataExpenses) => {
                this.chartDataExpenses = this.expensesGraph(graphDataExpenses);
                this.lastPrevisionExpense = this.getLastValue(graphDataExpenses.prevision);
                this.lastRealExpense = this.getLastValue(graphDataExpenses.reel);
                this.variationExpenses = this.calculateVariation(this.lastRealExpense, this.lastPrevisionExpense);
            });

            this.projectService.getGraphDataIncomes(projectId).subscribe((graphDataIncomes) => {
                this.chartDataIncomes = this.incomesGraph(graphDataIncomes);
                this.lastPrevisionIncome = this.getLastValue(graphDataIncomes.prevision);
                this.lastRealIncome = this.getLastValue(graphDataIncomes.reel);
                this.variationIncomes = this.calculateVariation(this.lastRealIncome, this.lastPrevisionIncome);
            });
        });
    }

    private getLastValue(data: number[]): number {
        return data.length > 0 ? data[data.length - 1] : 0;
    }
    private calculateVariation(reel: number, prevision: number): number {
        if (prevision === 0) {
            return 0; // Évite la division par zéro
        }
        return ((reel - prevision) / prevision) * 100;
    }
    private expensesGraph(graphDataExpenses: any): any {
        return {
            labels: graphDataExpenses.date,
            datasets: [
                {
                    label: 'Dépenses Réelles',
                    data: graphDataExpenses.reel, // ensure this matches your data structure
                    borderColor: '#FF5733',
                    backgroundColor: 'rgba(255, 87, 51, 0.2)',
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Prévisions Dépenses',
                    data: graphDataExpenses.prevision,
                    borderColor: '#33C3FF',
                    backgroundColor: 'rgba(51, 195, 255, 0.2)',
                    fill: true,
                    tension: 0.4,
                }
            ]
        };
    }

    private incomesGraph(graphDataIncomes: any): any {
        return {
            labels: graphDataIncomes.date, // ensure this matches your data structure
            datasets: [
                {
                    label: 'Rentrées Réelles',
                    data: graphDataIncomes.reel, // ensure this matches your data structure
                    borderColor: '#FF5733',
                    backgroundColor: 'rgba(255, 87, 51, 0.2)',
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Prévisions Rentrées',
                    data: graphDataIncomes.prevision,
                    borderColor: '#33C3FF',
                    backgroundColor: 'rgba(51, 195, 255, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    }
}
