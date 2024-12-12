import {Component, Input, OnInit} from '@angular/core';
import {CompteurWorktimeCategoryDTO, WorktimeCategoryDTO} from '../../models/compteur.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompteurWorktimeCategoryService} from '../../services/compteur-worktime-category.service';
import {UserCreateUpdateForm} from '../../forms/user.form';
import {CompteurCreateUpdateForm} from '../../forms/compteur.form';


/**
 * Composant pour afficher et gérer les compteurs d'un utilisateur.
 */

@Component({
  selector: 'app-user-compteurs',
  templateUrl: './user-compteurs.component.html',
  styleUrl: './user-compteurs.component.scss'
})
export class UserCompteursComponent implements OnInit {
    @Input() userId!: number; // L'ID de l'utilisateur dont on édite les compteurs

    compteurs: CompteurWorktimeCategoryDTO[] = []; // Liste des compteurs de l'user
    categories: WorktimeCategoryDTO[] = []; // Liste des catégories de compteurs
    compteurForm: FormGroup; // Form pour ajouter/modifier un compteur

    /**
     * Constructeur du composant pour gérer les compteurs d'un utilisateur.
     * @param _fb
     * @param compteurService
     */
    constructor(
        private _fb: FormBuilder,
        private compteurService: CompteurWorktimeCategoryService
    ) {
        // Initialise le form pour le compteur
        this.compteurForm = this._fb.group({...CompteurCreateUpdateForm});
    }

    ngOnInit(): void {
        this.loadCompteurs(); // Charge les compteurs de l'user
        this.loadCategories(); // Charge les catégories de compteurs

    }

    /**
     * Charge les compteurs de l'utilisateur en appelant le service compteurService.
     * @returns void
     */
    loadCompteurs(): void {
        this.compteurService.getCompteursByUserId(this.userId).subscribe({
            next: (data) => {
                this.compteurs = data;
            },
            error: (err) => {
                console.error("Erreur chargement compteurs:", err.error.errors);
            }
        });
    }

    /**
     * Charge les catégories de compteurs en appelant le service compteurService.
     * @returns void
     */
    loadCategories(): void {
        this.compteurService.getWorktimeCategories().subscribe({
            next: (categories) => {
                this.categories = categories
                    .map(category => ({
                        ...category,
                        displayLabel: `${category.abreviation} - ${category.name}`
                    }))
                    .sort((a, b) => a.idWorktimeCategory - b.idWorktimeCategory); // Tri par idWorktimeCategory
            },
            error: (err) => {
                console.error("Erreur chargement catégories de worktime:", err.error.errors);
            }
        });
    }

    /**
     * Retourne le nom de la catégorie pour un worktimeCategoryId.
     * @param id de la catégorie
     */
    getCategoryName(id: number): string {
        const cat = this.categories.find(c => c.idWorktimeCategory === id);
        // pour retrouver l'abréviation de la catégorie

        return cat ? cat.abreviation + ' - ' + cat.name : '';
    }

    /**
     * Soumet le formulaire d'ajout/modification de compteur.
     * Si on est en mode édition, on met à jour le compteur, sinon on ajoute un nouveau compteur.
     * @returns void
     */
    submitCompteur(): void {
        if (this.compteurForm.invalid) {
            this.compteurForm.markAllAsTouched(); // Marque tous les champs comme touchés pour afficher les erreurs
            return;
        }

        const formValue = this.compteurForm.value;
        // Cherche dans la liste des compteurs de l'user s'il y a déjà un compteur existant pour cette catégorie
        const existingCompteur = this.compteurs.find(c => c.worktimeCategoryId === formValue.worktimeCategoryId);

        if (existingCompteur) { // Si la catégorie existe déjà dans la liste des compteurs pour cet user : modification
            this.compteurService.updateCompteur(this.userId, { // Met à jour le compteur via le compteurService
                worktimeCategoryId: formValue.worktimeCategoryId,
                quantity: formValue.quantity
            }).subscribe({
                next: () => {
                    this.loadCompteurs();
                },
                error: (err) => {
                    console.error("Erreur modification compteur:", err.error.errors);
                }
            });
        } else { // Si la catégorie n'existe pas dans la liste des compteurs pour cet user : ajout de cette catégorie
            const newCompteur = {
                userId: this.userId,
                worktimeCategoryId: formValue.worktimeCategoryId,
                quantity: formValue.quantity
            };
            this.compteurService.addCompteur(newCompteur).subscribe({ // Ajoute le compteur via le compteurService
                next: () => {
                    this.loadCompteurs();
                },
                error: (err) => {
                    console.error("Erreur ajout compteur:", err.error.errors);
                }
            });
        }
    }

    /**
     * Supprime un compteur pour cet utilisateur.
     * @param compteur
     */
    deleteCompteur(compteur: CompteurWorktimeCategoryDTO): void {
        this.compteurService.deleteCompteur({ // Supprime le compteur via le compteurService
            userId: this.userId,
            worktimeCategoryId: compteur.worktimeCategoryId
        }).subscribe({
            next: () => {
                this.loadCompteurs();
            },
            error: (err) => {
                console.error("Erreur suppression compteur:", err.error.errors);
            }
        });
    }

}
