import {Component, OnInit} from '@angular/core';
import {RentreeCreateFormDTO, RentreeDTO} from '../../models/rentree.model';
import {LibeleDTO, OrganismeDTO} from '../../models/depense.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RentreeService} from '../../services/rentree.service';
import {ActivatedRoute} from '@angular/router';
import {RentreeCreateForm} from '../../forms/rentree.form';

@Component({
  selector: 'app-encodage-rentree-projet',
  templateUrl: './encodage-rentree-projet.component.html',
  styleUrl: './encodage-rentree-projet.component.scss'
})

/**
 * Composant gérant l'encodage des rentrées (entrées financières) d'un projet.
 * Permet d'ajouter et de modifier des rentrées.
 */
export class EncodageRentreeProjetComponent implements OnInit {
    selectedRentree: RentreeDTO | null = null; // Rentrée sélectionnée pour modification
    rentrees: RentreeDTO[] = []; // Liste des rentrées du projet
    categories: { idCategory: number, categoryName: string }[] = [];
    libeles: LibeleDTO[] = [];
    filteredLibeles: LibeleDTO[] = [];
    organismes: OrganismeDTO[] = []; // Liste des organismes pour le formulaire
    rentreeForm: FormGroup; // Formulaire d'ajout/modification de rentrée
    displayForm: boolean = false; // Contrôle de l'affichage du formulaire
    projectId!: number; // ID du projet, récupéré depuis la route

    /**
     * Constructeur du composant EncodageRentreeProjetComponent
     * @param rentreeService Service permettant la gestion des rentrées
     * @param fb FormBuilder pour construire le FormGroup
     * @param route ActivatedRoute pour accéder aux paramètres de l'URL
     */
    constructor(
        private rentreeService: RentreeService,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.rentreeForm = this.fb.group({...RentreeCreateForm});
    }

    /**
     * Méthode OnInit du composant.
     * Récupère l'id du projet, puis charge les rentrées, libellés et organismes.
     * @returns void
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id'); // Récupère l'ID du projet
            if (id) {
                this.projectId = +id; // Convertit en number
                this.loadRentrees(); // Charge les rentrées
            } else {
                console.error('Aucun projectId fourni dans les paramètres de la route.');
            }
        });
        this.loadLibeles(); // Charge les libellés
        this.loadOrganismes(); // Charge les organismes
    }

    /**
     * Charge les rentrées liées au projet.
     * @returns void
     */
    loadRentrees(): void {
        this.rentreeService.getRentreesByProjectId(this.projectId).subscribe({
            next: (rentrees) => {
                // Trie les rentrées par dateFacturation décroissante
                this.rentrees = rentrees.sort(
                    (a, b) => new Date(b.dateFacturation).getTime() - new Date(a.dateFacturation).getTime()
                );
            },
            error: (err) => {
                console.error("Erreur chargement rentrées:", err.error.errors);
            }
        });
    }

    /**
     * Charge les libellés pour le formulaire.
     * @returns void
     */
    loadLibeles(): void {
        this.rentreeService.getLibeles().subscribe({
            next: (libeles) => {
                this.libeles = libeles;
                this.categories = [...new Map(libeles
                    .filter(item => item.isIncome) // Filtrer les catégories de rentrées
                    .map(item => [item.idCategory, { idCategory: item.idCategory, categoryName: item.categoryName || 'catégorie inconnue' }])
                ).values()];
            },
            error: (err) => {
                console.error("Erreur chargement libellés:", err.error.errors);
            }
        });
    }

    /**
     * Méthode appelée lors du changement de catégorie dans le formulaire afin de filtrer les libelés par rapport à la catégorie sélectionnée.
     * @returns void
     */
    onCategoryChange(): void {
        const selectedCategoryId = this.rentreeForm.get('categoryId')?.value;
        this.filteredLibeles = this.libeles.filter(libele => libele.idCategory === selectedCategoryId && libele.isIncome);
        this.rentreeForm.get('idLibele')?.setValue(null); // Reset idLibele when category changes
    }

    /**
     * Charge les organismes pour le formulaire.
     * @returns void
     */
    loadOrganismes(): void {
        this.rentreeService.getOrganismes().subscribe({
            next: (organismes) => {
                this.organismes = organismes; // Stocke les organismes
            },
            error: (err) => {
                console.error("Erreur chargement organismes:", err);
            }
        });
    }

    /**
     * Ouvre le formulaire d'ajout d'une rentrée.
     * @returns void
     */
    openAddRentreeForm(): void {
        this.rentreeForm.reset(); // Reset le formulaire
        this.displayForm = true; // Affiche le dialog
    }

    /**
     * Ouvre le formulaire pour modifier une rentrée existante.
     * Préremplit le formulaire avec les données de la rentrée.
     * @param rentree La rentrée à modifier
     * @returns void
     */
    openEditRentreeForm(rentree: RentreeDTO): void {
        this.selectedRentree = rentree; // Mode édition
        // Préremplit le formulaire
        const categoryId = this.libeles.find(l => l.idLibele === rentree.idLibele)?.idCategory;
        this.rentreeForm.patchValue({
            idLibele: rentree.idLibele,
            categoryId: categoryId,
            idOrganisme: rentree.idOrganisme,
            montant: rentree.montant,
            dateFacturation: rentree.dateFacturation ? new Date(rentree.dateFacturation) : null,
            motif: rentree.motif ?? null
        });
        this.onCategoryChange(); // Charger les libellés pour la catégorie sélectionnée
        this.rentreeForm.get('idLibele')?.setValue(rentree.idLibele); // Assure que le libellé est bien sélectionné
        this.displayForm = true; // Affiche le dialog
    }

    /**
     * Méthode appelée à la fermeture du dialog.
     * Réinitialise displayForm et selectedRentree
     * @returns void
     */
    onDialogHide(): void {
        this.displayForm = false;
        this.selectedRentree = null;
    }


    /**
     * Récupère le nom du libellé en fonction de son ID.
     * @param idLibele - ID du libellé.
     * @returns string - Nom du libellé.
     */
    getLibeleName(idLibele: number): string {
        const libele = this.libeles.find((l) => l.idLibele === idLibele);
        return libele && libele.libeleName ? libele.libeleName : '';
    }

    /**
     * Récupère le nom de l'organisme en fonction de son ID.
     * @param idOrganisme - ID de l'organisme.
     * @returns string - Nom de l'organisme.
     */
    getOrganismeName(idOrganisme: number): string {
        const organisme = this.organismes.find((o) => o.idOrganisme === idOrganisme);
        return organisme ? organisme.name || '' : '';
    }

    /**
     * Soumet le formulaire pour ajouter ou modifier une rentrée.
     * @returns void
     */
    submitRentree() {
        if (this.rentreeForm.invalid) {
            this.rentreeForm.markAllAsTouched(); // Marque tous les champs comme touchés, affichant les erreurs
            return;
        }
        // Récupération des valeurs du formulaire
        const formValue = this.rentreeForm.value;

        // Prépare l'objet à envoyer à l'API
        const newRentree: RentreeCreateFormDTO = {
            idLibele: formValue.idLibele,
            categoryId: formValue.categoryId,
            idProject: this.projectId,
            idOrganisme: formValue.idOrganisme,
            montant: formValue.montant,
            dateFacturation: formValue.dateFacturation ? formValue.dateFacturation.toISOString() : null,
            motif: formValue.motif,
        };

        // Mode Modification
        if (this.selectedRentree) {
            // Mode modification
            this.rentreeService.updateRentree(this.selectedRentree.idRentree, newRentree).subscribe({
                next: (updatedRentree) => {
                    // Recharger la liste depuis le serveur
                    this.loadRentrees();
                    this.displayForm = false;
                    this.rentreeForm.reset();
                    this.selectedRentree = null;
                },
                error: (err) => {
                    console.error("Erreur lors de la modification de la rentrée:", err.error.errors);
                }
            });
        } else {
            // Mode ajout
            this.rentreeService.addRentree(newRentree).subscribe({
                next: (rentree) => {
                    this.displayForm = false;
                    this.rentreeForm.reset();
                    this.selectedRentree = null;
                    this.loadRentrees(); // Recharger pour voir la nouvelle rentrée
                },
                error: (err) => {
                    console.error("Erreur lors de l'ajout de la rentrée:", err.error.errors);
                }
            });
        }
    }
}
