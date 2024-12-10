import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LibeleWithName, Project} from '../../models/project.model';
import {ActivatedRoute} from '@angular/router';
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

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
    incomeCategories: any[] = [];
    filteredIncomeLibeles: LibeleWithName[] = [];
    filteredExpenseLibeles: LibeleWithName[] = [];
    projectId!: number; // Store the dynamic project ID
    projectDetails!: Project
    libelesFraisGeneraux: LibeleWithName[] = [];
    totalFraisGeneraux: number = 0;
    fraisGenerauxForm: FormGroup;

    constructor(private fb: FormBuilder, private projectService: ProjectService, private route: ActivatedRoute) {
        this.previsionIncomesForm = this.fb.group({
            date: ['', Validators.required],
            motif: ['', Validators.required],
            idCategory: ['', Validators.required],
            idLibele: [{value: '', disabled: true}, Validators.required], // Disabled until category is selected
            montant: [0, [Validators.required, Validators.min(1)]],
        });

        this.previsionExpensesForm = this.fb.group({
            date: ['', Validators.required],
            motif: ['', Validators.required],
            idCategory: ['', Validators.required],
            idLibele: [{value: '', disabled: true}, Validators.required], // Disabled until category is selected
            montant: [0, [Validators.required, Validators.min(1)]],
        });

        this.fraisGenerauxForm = this.fb.group({
            libeleValues: this.fb.array([]),
        });
    }

    ngOnInit() {
        // Fetch the project ID from the route and load data
        this.projectId = +this.route.snapshot.paramMap.get('id')!;
        if (!this.projectId) {
            console.error('No project ID provided in the route');
            return;
        }
        this.loadProjectDetails();
        this.loadIncomeLibeles();
        this.loadExpenseLibeles();
        this.loadExpenseCategories();
        this.loadIncomeCategories();
        this.loadIncomesPrevisions();
        this.loadExpensesPrevisions();
        this.initFraisGenerauxForm();
    }

    loadProjectDetails(): void {
        this.projectService.getProjectById(this.projectId).subscribe((details) => {
            this.projectDetails = details;
        });
    }

    // Load Libeles (only for idCategory 1)
    loadIncomeLibeles(): void {
        this.projectService.getLibeles().subscribe((libeles) => {
            this.incomeLibeles = libeles.filter((libele) => libele.isIncome);
        });
    }

    loadExpenseLibeles(): void {
        this.projectService.getLibeles().subscribe((libeles) => {
            this.expenseLibeles = libeles.filter((libele) => !libele.isIncome);
        });
    }

    loadExpenseCategories(): void {
        this.projectService.getCategories().subscribe((categories) => {
            this.expenseCategories = categories.filter((category) => !category.isIncome);
        });
    }

    loadIncomeCategories(): void {
        this.projectService.getCategories().subscribe((categories) => {
            this.incomeCategories = categories.filter((category) => category.isIncome);
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
            this.previsionExpenses = this.previsionExpenses.filter((expense) => (expense.isIncome === false))
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

    initFraisGenerauxForm(): void {
        this.projectService.getLibeles().subscribe((libeles) => {
            this.libelesFraisGeneraux = libeles.filter(
                (libele) => libele.idCategory === 4
            ); // Assuming idCategory 4 corresponds to "Frais Generaux"
            const controls = this.libelesFraisGeneraux.map(() =>
                this.fb.control(0, [Validators.required, Validators.min(0)])
            );
            this.fraisGenerauxForm.setControl('libeleValues', this.fb.array(controls));
        });
    }

    calculateTotalFraisGeneraux(): void {
        const libeleValues = this.fraisGenerauxForm.get('libeleValues') as FormArray;
        this.totalFraisGeneraux = libeleValues.controls.reduce(
            (sum, control) => sum + Number(control.value || 0),
            0
        );
    }

    submitFraisGeneraux(): void {
        const startDate = new Date(this.projectDetails.dateDebutProjet);
        const endDate = new Date(this.projectDetails.dateFinProjet);
        const totalMonths = this.calculateProjectDurationMonths(startDate, endDate);
        const monthlyAmount = this.totalFraisGeneraux / totalMonths;

        // Generate all entries for the project's duration
        const fraisGenerauxExpenses = [];
        for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
            fraisGenerauxExpenses.push({
                date: new Date(date).toISOString(), // Use the 1st of each month
                motif: 'Tranche mensuelle frais généraux',
                categoryId: 4, // Assuming idCategory 4 corresponds to "Frais Generaux"
                montant: monthlyAmount,
                projectId: this.projectId,
            });
        }

        // Submit each entry to the backend
        let completedRequests = 0;
        fraisGenerauxExpenses.forEach((expense) => {
            this.projectService.addPrevisionExpenseByCategory(expense).subscribe({
                next: () => {
                    completedRequests++;
                    console.log('Expense added:', expense);

                    // Reload data once all requests are complete
                    if (completedRequests === fraisGenerauxExpenses.length) {
                        this.loadExpensesPrevisions();
                        console.log('All frais généraux expenses submitted successfully.');
                    }
                },
                error: (err) => console.error('Error adding frais généraux expense:', err),
            });
        });

        this.loadExpensesPrevisions();
        this.previsionExpensesForm.reset();
    }

    isAnyFraisGenerauxFilled(): boolean {
        return this.fraisGenerauxForm.value.libeleValues.some(
            (value: number) => value && value > 0
        );
    }

    calculateProjectDurationMonths(startDate: Date, endDate: Date): number {
        const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1); // Start of the month
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1); // End of the month
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth() + 1);
        return Math.max(months, 1); // Ensure at least 1 month
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

    // Filter Expenses Libeles based on selected category
    onExpenseCategoryChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const idCategory = Number(target.value);
        if (!isNaN(idCategory)) {
            this.filteredExpenseLibeles = this.expenseLibeles.filter((libele) => libele.idCategory === idCategory);
            this.previsionExpensesForm.get('idLibele')?.enable();
        } else {
            this.filteredExpenseLibeles = [];
            this.previsionExpensesForm.get('idLibele')?.disable();
        }
    }

    // Filter Income Libeles based on selected category
    onIncomeCategoryChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const idCategory = Number(target.value);
        if (!isNaN(idCategory)) {
            console.log(this.incomeLibeles)
            this.filteredIncomeLibeles = this.incomeLibeles.filter((libele) => libele.idCategory === idCategory);
            this.previsionIncomesForm.get('idLibele')?.enable();
        } else {
            this.filteredIncomeLibeles = [];
            this.previsionIncomesForm.get('idLibele')?.disable();
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
            return {...entry, cumul};
        });
    }
}
