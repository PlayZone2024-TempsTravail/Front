import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LibeleWithName} from '../../models/project.model';
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
    FraisGenerauxForm: FormGroup;
    previsionIncomes: any[] = [];
    previsionExpenses: any[] = [];
    incomeLibeles: LibeleWithName[] = [];
    expenseLibeles: LibeleWithName[] = [];
    expenseCategories: any[] = [];
    incomeCategories: any[] = [];
    filteredIncomeLibeles: LibeleWithName[] = [];
    filteredExpenseLibeles: LibeleWithName[] = [];
    projectId!: number; // Store the dynamic project ID
    libelesFraisGeneraux: any[] = [];
    filteredLibeles: any[] = [];
    totalFraisGeneraux: number = 0;
    libeleValues: any[] = [];

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
        this.FraisGenerauxForm = this.fb.group({
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
        this.loadIncomeLibeles();
        this.loadExpenseLibeles();
        this.loadExpenseCategories();
        this.loadIncomeCategories();
        this.loadIncomesPrevisions();
        this.loadExpensesPrevisions();
        this.initFraisGenerauxForm();
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
            this.libelesFraisGeneraux = libeles.filter((libele) => libele.idCategory === 4);
        });
    }

    CalcultotalFraisGeneraux() {
        const libeleValues = this.FraisGenerauxForm.get('libeleValues') ;

        this.totalFraisGeneraux = libeleValues!.value.reduce(
            (sum: number, libele: any) => sum + Number(libele.value), 0);
    }

    get libeleValueArray() {
        return this.FraisGenerauxForm.get('libeleValues') ;
    }

    submitForm() {
        console.log('Form Values:', this.FraisGenerauxForm.value.libeleValues);
        console.log('Total des frais généraux:', this.totalFraisGeneraux);

        //TODO
        // Post vers API prevision LIBELE
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
