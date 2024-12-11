import {Component, OnInit} from '@angular/core';
import {Depense} from '../../models/project.model';
import {ProjectService} from '../../services/project.service';
import {CreateDepenseDTO, DepenseDTO, LibeleDTO, OrganismeDTO, ProjectDTO} from '../../models/depense.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DepenseService} from '../../services/depense.service';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {DepenseCreateForm} from '../../forms/depense.form';

@Component({
  selector: 'app-encodage-couts-projet',
  templateUrl: './encodage-couts-projet.component.html',
  styleUrl: './encodage-couts-projet.component.scss'
})

/**
 * Composant gérant l'encodage des coûts d'un projet (dépenses).
 * Permet d'ajouter et de modifier des dépenses liées à un projet.
 */
export class EncodageCoutsProjetComponent implements OnInit {

    selectedDepense: DepenseDTO | null = null; // Dépense sélectionnée pour une éventuelle modification
    depenses: DepenseDTO[] = []; // Liste des dépenses du projet
    libeles: LibeleDTO[] = []; // Liste des libellés disponibles pour sélectionner la "nature" de la dépense
    organismes: OrganismeDTO[] = []; // Liste des organismes disponibles
    depenseForm: FormGroup; // Formulaire d'ajout ou de modification de dépense
    displayForm: boolean = false; // Indique si le formulaire (dialog) est affiché
    projectId!: number; // ID du projet en cours, récupéré depuis les paramètres de la route

    /**
     * Constructeur du composant EncodageDepenseProjetComponent
     * @param depenseService Service permettant la gestion des dépenses
     * @param fb FormBuilder pour construire le FormGroup
     * @param route ActivatedRoute pour accéder aux paramètres de l'URL
     */
    constructor(
        private depenseService: DepenseService,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
            this.depenseForm = this.fb.group({...DepenseCreateForm});
        }

    ngOnInit(): void {
        // Abonnement aux changements des paramètres de la route afin d'obtenir l'id du projet
        this.route.paramMap.subscribe(params => {
            const id = params.get('id'); // récupère l'id du projet depuis l'URL
            if (id) {
                this.projectId = +id; // +id pour convertir l'id en nombre
                this.loadDepenses(); // Charge la liste des dépenses du projet depuis l'API
            } else {
                console.error('Aucun projectId fourni dans les paramètres de la route.');
            }
        });
        this.loadLibeles(); // chargement des libellés (nature) dans le dropdown
        this.loadOrganismes(); // chargement des organismes dans le dropdown
    }

    /**
     * Charge les dépenses liées au projet.
     * @returns void
     */
    loadDepenses(): void {
        // Appel du service pour récupérer les dépenses du projet
        this.depenseService.getDepensesByProjectId(this.projectId).subscribe((depenses) => {
            // Trie les dépenses par date de facturation décroissante
            this.depenses = depenses.sort(
                (a, b) => new Date(b.dateFacturation).getTime() - new Date(a.dateFacturation).getTime()
            );
        });
    }

    /**
     * Charge les libellés pour le formulaire.
     * @returns void
     */
    loadLibeles(): void {
        // Appel du service pour récupérer les libellés
        this.depenseService.getLibeles().subscribe((libeles) => {
            // TODO: filtrer les libellés pour ne récupérer que ceux qui sont des dépenses
            this.libeles = libeles; // Stocke les libellés dans la propriété libeles
        });
    }

    /**
     * Charge les organismes pour le formulaire.
     * @returns void
     */
    loadOrganismes(): void {
        // Appel du service pour récupérer les organismes
        this.depenseService.getOrganismes().subscribe((organismes) => {
            this.organismes = organismes; // Stocke les organismes
        });
    }


    /**
     * Ouvre le formulaire d'ajout d'une dépense.
     * @returns void
     */
    openAddDepenseForm(): void {
        this.selectedDepense = null; // Aucune dépense sélectionnée -> mode ajout
        this.depenseForm.reset(); // Reset du formulaire
        this.displayForm = true; // Affiche le dialog du formulaire
    }

    /**
     * Ouvre le formulaire de modification pour une dépense existante.
     * Préremplit le formulaire avec les données de la dépense sélectionnée.
     * @param depense La dépense à modifier
     * @returns void
     */
    openEditDepenseForm(depense: DepenseDTO): void {
        this.selectedDepense = depense; // Stocke la dépense dans selectedDepense => mode édition
        // Préremplit le formulaire avec les infos de la dépense
        this.depenseForm.patchValue({
            libeleId: depense.libeleId,
            organismeId: depense.organismeId ?? null,
            motif: depense.motif ?? null,
            montant: depense.montant,
            dateIntervention: depense.dateIntervention ? new Date(depense.dateIntervention) : null,
            dateFacturation: new Date(depense.dateFacturation),
        });
        this.displayForm = true; // Affiche le formulaire
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
     * Soumet le formulaire d'ajout d'une dépense.
     * Crée une dépense à partir des données du formulaire et l'ajoute au projet.
     */
    submitDepense() : void {
        if (this.depenseForm.invalid) {
            this.depenseForm.markAllAsTouched(); // Marque tous les champs comme touchés, affichant les erreurs
            return;
        }

        // Récupération des valeurs du formulaire
        const formValue = this.depenseForm.value;

        // Prépare l'objet à envoyer à l'API
        const newDepense: CreateDepenseDTO = {
            projectId: this.projectId,
            libeleId: formValue.libeleId,
            organismeId: formValue.organismeId,
            montant: formValue.montant,
            dateIntervention: formValue.dateIntervention ? formValue.dateIntervention.toISOString() : null,
            dateFacturation: formValue.dateFacturation ? formValue.dateFacturation.toISOString() : null,
            motif: formValue.motif,
        };

        // Mode Modification
        if (this.selectedDepense) {
            const depenseId = this.selectedDepense.idDepense;
            // Appel du service pour mettre à jour la dépense
            this.depenseService.updateDepense(depenseId, newDepense).subscribe({
                next: (updatedDepense) => {
                    // Met à jour la dépense dans la liste locale si nécessaire (ici on recharge la liste ensuite)
                    const index = this.depenses.findIndex(d => d.idDepense === depenseId);
                    if (index !== -1) {
                        this.depenses[index] = updatedDepense;
                    }
                    this.displayForm = false; // Ferme le formulaire
                    this.depenseForm.reset(); // Reset le formulaire
                    this.selectedDepense = null; // Plus de dépense sélectionnée
                    this.loadDepenses(); // Recharge la liste depuis l'API
                },
                error: (err) => {
                    console.log('Données du formulaire soumises :', newDepense);
                    console.error('Erreur lors de la modification de la dépense:', err.error.errors);
                }
            });
        }
        else {
            // Mode Ajout
            // Appelle le service pour ajouter la dépense
            this.depenseService.addDepense(newDepense).subscribe((depense) => {
                this.displayForm = false; // Ferme le formulaire
                this.selectedDepense = null; // Réinitialise la sélection
                this.depenseForm.reset(); // Reset le formulaire
                this.loadDepenses(); // Recharge la liste, la nouvelle dépense doit apparaître
            });
        }
    }
}
