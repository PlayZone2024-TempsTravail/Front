import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LibeleWithName } from '../../models/project.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-project-modification',
    templateUrl: './project-modification.component.html',
    styleUrl: './project-modification.component.scss'
})
export class ProjectModificationComponent implements OnInit {
    previsionIncomesForm: FormGroup;
    previsionExpensesForm: FormGroup;
    previsionIncomes: any[] = [];
    previsionExpenses: any[] = [];
    incomeLibeles: LibeleWithName[] = [];
    expenseLibeles: LibeleWithName[] = [];
    expenseCategories: any[] = [];
    filteredExpenseLibeles: LibeleWithName[] = [];
    projectId!: number; // Store the dynamic project ID

    constructor(private fb: FormBuilder, private projectService: ProjectService, private route: ActivatedRoute) {
        this.previsionIncomesForm = this.fb.group({
            date: ['', Validators.required],
            motif: ['', Validators.required],
            libeleId: ['', Validators.required],
            montant: [0, [Validators.required, Validators.min(1)]],
        });

        this.previsionExpensesForm = this.fb.group({
            date: ['', Validators.required],
            motif: ['', Validators.required],
            categoryId: ['', Validators.required],
            libeleId: [{ value: '', disabled: true }, Validators.required], // Disabled until category is selected
            montant: [0, [Validators.required, Validators.min(1)]],
        });
    }

    ngOnInit() {
        // Fetch the project ID from the route and load data
        this.projectId = +this.route.snapshot.paramMap.get('id')!;
        if (!this.projectId) {
            console.error('No project ID provided in the route');
            return;
        }
        this.loadIncomeLibeles();
        this.loadExpenseLibeles();
        this.loadExpenseCategories();
        this.loadIncomesPrevisions();
        this.loadExpensesPrevisions();
    }

    // Load Libeles (only for idCategory 1)
    loadIncomeLibeles(): void {
        this.projectService.getLibeles().subscribe((libeles) => {
            this.incomeLibeles = libeles.filter((libele) => libele.idCategory === 1);
        });
    }

    loadExpenseLibeles(): void {
        this.projectService.getLibeles().subscribe((libeles) => {
            this.expenseLibeles = libeles.filter((libele) => libele.idCategory !== 1);
        });
    }

    loadExpenseCategories(): void {
        this.projectService.getCategories().subscribe((categories) => {
            this.expenseCategories = categories.filter((category) => !category.isIncome);
        });
    }

    // Load Previsions Entrées
    loadIncomesPrevisions(): void {
        this.projectService.getPrevisionalIncomes(this.projectId).subscribe((data) => {
            this.previsionIncomes = this.calculateCumul(data);
        });
    }

    // Load Previsions Dépenses
    loadExpensesPrevisions(): void {
        this.projectService.getPrevisionalExpenses(this.projectId).subscribe((data) => {
            this.previsionExpenses = this.calculateCumul(data);
        });
    }

    // Add a new income
    addPrevisionIncome(): void {
        const newIncome = this.previsionIncomesForm.value;
        newIncome.projectId = this.projectId; // Use dynamic project ID
        this.projectService.addPrevisionIncome(newIncome).subscribe(() => {
            this.loadIncomesPrevisions(); // Reload the list after adding
            this.previsionIncomesForm.reset();
        });
    }

    // Add new expense
    addPrevisionExpense(): void {
        const newExpense = this.previsionExpensesForm.value;
        newExpense.projectId = this.projectId; // Use dynamic project ID
        this.projectService.addPrevisionExpense(newExpense).subscribe(() => {
            this.loadExpensesPrevisions(); // Reload the list after adding
            this.previsionExpensesForm.reset();
        });
    }

    // Filter Libeles based on selected category
    onCategoryChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const categoryId = Number(target.value);

        if (isNaN(categoryId)) {
            this.filteredExpenseLibeles = [];
            this.previsionExpensesForm.get('libeleId')?.disable();
        } else {
            this.filteredExpenseLibeles = this.expenseLibeles.filter((libele) => libele.idCategory === categoryId);
            this.previsionExpensesForm.get('libeleId')?.enable();
        }
    }

    // Delete a prevision income
    deletePrevisionIncome(id: number): void {
        if (confirm('Are you sure you want to delete this entry?')) {
            this.projectService.deletePrevisionIncome(id).subscribe(() => {
                console.log('Income deleted successfully');
                this.loadIncomesPrevisions(); // Reload the list after deleting
            });
        }
    }

    // Delete a prevision expense
    deletePrevisionExpense(id: number): void {
        if (confirm('Are you sure you want to delete this entry?')) {
            this.projectService.deletePrevisionExpense(id).subscribe(() => {
                console.log('Expense deleted successfully');
                this.loadExpensesPrevisions(); // Reload the list after deleting
            });
        }
    }

    // Calculate the cumulative amount
    calculateCumul(entries: any[]): any[] {
        // Sort by date in ascending order
        entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let cumul = 0;
        return entries.map((entry) => {
            cumul += entry.montant;
            return { ...entry, cumul };
        });
    }
}
