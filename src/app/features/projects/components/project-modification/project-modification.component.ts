import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Category, LibeleWithName} from '../../models/project.model';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

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
    isEstimationByCategory: boolean = false;

    constructor(private fb: FormBuilder, private projectService: ProjectService, private route: ActivatedRoute) {
        this.previsionIncomesForm = this.fb.group({
            date: ['', Validators.required],
            motif: ['', Validators.required],
            idCategory: ['', Validators.required],
            idLibele: [{ value: '', disabled: true }, Validators.required], // Disabled until category is selected
            montant: [0, [Validators.required, Validators.min(1)]],
        });

        this.previsionExpensesForm = this.fb.group({
            date: ['', Validators.required],
            motif: ['', Validators.required],
            idCategory: ['', Validators.required],
            idLibele: [{ value: '', disabled: true }, Validators.required], // Disabled until category is selected
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
        this.loadIncomeCategories();
        this.loadIncomesPrevisions();
        this.loadExpensesPrevisions();
    }

    // Charger Libelles Entrees
    loadIncomeLibeles(): void {
        this.projectService.getLibeles().subscribe((libeles) => {
            this.incomeLibeles = libeles.filter((libele) => libele.isIncome);
        });
    }

    // Charger Libelles Depenses
    loadExpenseLibeles(): void {
        this.projectService.getLibeles().subscribe((libeles) => {
            this.expenseLibeles = libeles.filter((libele) => !libele.isIncome);
        });
    }

    // Charger Categories Depenses
    loadExpenseCategories(): void {
        this.projectService.getCategories().subscribe((categories) => {
            this.expenseCategories = categories.filter((category) => !category.isIncome);
        });
    }

    // Charger Categories Entrees
    loadIncomeCategories(): void {
        this.projectService.getCategories().subscribe((categories) => {
            this.incomeCategories = categories.filter((category) => category.isIncome);
        });
    }

    // Charger Previsions Entrees
    loadIncomesPrevisions(): void {
        this.projectService.getPrevisionalIncomes(this.projectId).subscribe((data) => {
            this.previsionIncomes = this.calculateCumul(data);
        });
    }

    // Charger Previsions Dépenses
    loadExpensesPrevisions(): void {
        this.projectService.getCategories().subscribe((categories: Category[]) => {
            this.isEstimationByCategory = categories.some((category) => category.estimationParCategorie);
            categories.reduce((map, category) => {
                map[category.idCategory] = category.estimationParCategorie;
                return map;
            }, {} as { [key: number]: boolean });
            forkJoin([
                this.projectService.getPrevisionalExpensesByCategory(this.projectId),
                this.projectService.getPrevisionalExpensesByLibele(this.projectId),
            ]).subscribe(([categoryData, libeleData]) => {
                const filteredCategoryExpenses = categoryData
                    .filter((expense) => expense.isIncome === false) // Filter out incomes
                    .map((expense) => ({
                        ...expense,
                        estimationParCategorie: true,
                        libeleName: '', // Ensure libeleName is blank for category-based expenses
                    }));

                const filteredLibeleExpenses = libeleData.map((expense) => ({
                    ...expense,
                    estimationParCategorie: false, // Libele-based expenses do not use category estimation
                }));

                // Combine both arrays
                const combinedExpenses = [...filteredCategoryExpenses, ...filteredLibeleExpenses];

                // Debug combined expenses
                console.log('Combined Expenses:', combinedExpenses);

                // Calculate cumulative amounts
                this.previsionExpenses = this.calculateCumul(combinedExpenses);

                // Final debug log
                console.log('Final previsionExpenses:', this.previsionExpenses);
            });
        });
    }

    // Ajouter une entree
    addPrevisionIncome(): void {
        const newIncome = this.previsionIncomesForm.value;
        newIncome.projectId = this.projectId; // Use dynamic project ID
        newIncome.organismeId = null;
        newIncome.libeleId = newIncome.idLibele; // Ensure the correct key is used
        this.projectService.addPrevisionIncome(newIncome).subscribe(() => {
            this.loadIncomesPrevisions(); // Reload the list after adding
            this.previsionIncomesForm.reset();
        });
    }

    // Ajouter une depense
    addPrevisionExpense(): void {
        const newExpense = this.previsionExpensesForm.value;
        newExpense.projectId = this.projectId;

        // Log the form values
        console.log("Adding Expense:", newExpense);

        // Adjust keys for the API
        newExpense.categoryId = newExpense.idCategory; // Map idCategory to categoryId

        // Find the selected category
        const selectedCategory = this.expenseCategories.find(
            (category) => category.idCategory == newExpense.idCategory
        );

        // Log the selected category
        console.log("Selected Category:", selectedCategory);

        if (selectedCategory?.estimationParCategorie) {
            // Log for category estimation
            console.log("Estimation by Category - POSTing to PrevisionBudgetCategory");
            this.projectService.addPrevisionExpenseByCategory(newExpense).subscribe({
                next: () => {
                    console.log("Expense by Category added successfully.");
                    this.loadExpensesPrevisions();
                    this.previsionExpensesForm.reset();
                },
                error: (err) => {
                    console.error("Error during addPrevisionExpenseByCategory:", err);
                }
            });
        } else {
            // Construct the payload for PrevisionBudgetLibele POST
            const libeleExpensePayload = {
                idProject: newExpense.projectId,
                categoryId: newExpense.idCategory,
                idLibele: newExpense.idLibele, // Ensure this matches API expectations
                date: newExpense.date,
                motif: newExpense.motif,
                montant: newExpense.montant,
            };

            console.log("Detailed Estimation - POSTing to PrevisionBudgetLibele");
            console.log("Payload for Libele Expense:", libeleExpensePayload);

            this.projectService.addPrevisionExpenseByLibele(libeleExpensePayload).subscribe({
                next: () => {
                    console.log("Expense by Libele added successfully.");
                    this.loadExpensesPrevisions();
                    this.previsionExpensesForm.reset();
                },
                error: (err) => {
                    console.error("Error during addPrevisionExpenseByLibele:", err);
                },
            });
        }
    }

    // Filtrer les libelles de depenses selon la categorie
    onExpenseCategoryChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const idCategory = Number(target.value);
        const selectedCategory = this.expenseCategories.find((category) => category.idCategory === idCategory);

        if (selectedCategory?.estimationParCategorie) {
            this.previsionExpensesForm.get('idLibele')?.disable();
            this.filteredExpenseLibeles = [];
        } else {
            this.filteredExpenseLibeles = this.expenseLibeles.filter((libele) => libele.idCategory === idCategory);
            this.previsionExpensesForm.get('idLibele')?.enable();
        }
    }

    // Filtrer les libelles de entrees selon la categorie
    onIncomeCategoryChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const idCategory = Number(target.value);
        if (!isNaN(idCategory)) {
            this.filteredIncomeLibeles = this.incomeLibeles.filter((libele) => libele.idCategory === idCategory);
            this.previsionIncomesForm.get('idLibele')?.enable();
        } else {
            this.filteredIncomeLibeles = [];
            this.previsionIncomesForm.get('idLibele')?.disable();
        }
    }

    // Delete une entree
    deletePrevisionIncome(id: number): void {
        if (confirm('Are you sure you want to delete this entry?')) {
            this.projectService.deletePrevisionIncome(id).subscribe(() => {
                console.log('Income deleted successfully');
                this.loadIncomesPrevisions(); // Reload the list after deleting
            });
        }
    }

    // Delete une depense
    deletePrevisionExpense(id: number): void {
        const selectedExpense = this.previsionExpenses.find(
            (expense) =>
                expense.idPrevisionBudgetCategory === id || expense.idPrevisionBudgetLibele === id
        );

        if (selectedExpense?.estimationParCategorie) {
            // Use the correct key for PrevisionBudgetCategory
            const categoryId = selectedExpense.idPrevisionBudgetCategory;
            this.projectService.deletePrevisionExpenseByCategory(categoryId).subscribe({
                next: () => {
                    console.log(`Category-based expense with ID ${categoryId} deleted.`);
                    this.loadExpensesPrevisions(); // Refresh the list
                },
                error: (err) => {
                    console.error(`Failed to delete category-based expense with ID ${categoryId}`, err);
                },
            });
        } else {
            // Use the correct key for PrevisionBudgetLibele
            const libeleId = selectedExpense.idPrevisionBudgetLibele;
            this.projectService.deletePrevisionExpenseByLibele(libeleId).subscribe({
                next: () => {
                    console.log(`Libele-based expense with ID ${libeleId} deleted.`);
                    this.loadExpensesPrevisions(); // Refresh the list
                },
                error: (err) => {
                    console.error(`Failed to delete libele-based expense with ID ${libeleId}`, err);
                },
            });
        }
    }

    // Calcul du cumul
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
