import { Component, OnInit } from '@angular/core';
import { ProjectService} from '../../services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LibeleWithName} from '../../models/project.model';

@Component({
    selector: 'app-project-modification',
    templateUrl: './project-modification.component.html',
    styleUrl: './project-modification.component.scss'
})
export class ProjectModificationComponent implements OnInit {
    previsionIncomesForm: FormGroup;
    previsionIncomes: any[] = [];
    incomeLibeles: LibeleWithName[] = [];

    constructor(private fb: FormBuilder, private projectService: ProjectService) {
        this.previsionIncomesForm = this.fb.group({
            date: ['', Validators.required],
            motif: ['', Validators.required],
            libeleId: ['', Validators.required],
            montant: [0, [Validators.required, Validators.min(1)]],
        });
    }

    ngOnInit() {
        this.loadLibeles();
        this.loadPrevisions();
    }

    // Load Libeles (only for idCategory 1)
    loadLibeles(): void {
        this.projectService.getLibeles().subscribe((libeles) => {
            this.incomeLibeles = libeles.filter((libele) => libele.idCategory === 1);
        });
    }


    // Load Previsions Entrées
    loadPrevisions(): void {
        const projectId = 1; // Replace with dynamic projectId


        this.projectService.getPrevisionalIncomes(projectId).subscribe((data) => {
            this.previsionIncomes = this.calculateCumul(data);
        });
    }

    // Add a new income
    addPrevisionIncome(): void {
        const newIncome = this.previsionIncomesForm.value;
        newIncome.projectId = 1; // Replace with dynamic projectId
        this.projectService.addPrevisionIncome(newIncome).subscribe(() => {
            this.loadPrevisions(); // Reload the list after adding
            this.previsionIncomesForm.reset();
        });
    }

    // Delete a prevision income
    deletePrevisionIncome(id: number): void {
        if (confirm('Are you sure you want to delete this entry?')) {
            this.projectService.deletePrevisionIncome(id).subscribe(() => {
                console.log('Income deleted successfully');
                this.loadPrevisions(); // Reload the list after deleting
            });
        }
    }

    calculateCumul(incomes: any[]): any[] {
        // Sort by date in ascending order
        incomes.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let cumul = 0;
        return incomes.map((income) => {
            cumul += income.montant;
            return { ...income, cumul };
        });
    }
}
