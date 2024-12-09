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
export class EncodageCoutsProjetComponent implements OnInit {

    depenses: DepenseDTO[] = []; // Liste des dépenses du projet
    libeles: LibeleDTO[] = []; // Liste des libellés pour le formulaire
    organismes: OrganismeDTO[] = []; // Liste des organismes pour le formulaire
    depenseForm: FormGroup; // Formulaire d'ajout de dépense
    displayForm: boolean = false; // Contrôle de l'affichage du formulaire
    projectId!: number; // ID du projet actif

    constructor(
        private depenseService: DepenseService,
        private fb: FormBuilder,
        private route: ActivatedRoute // pour récupérer les paramètres de la route
    ) {
            this.depenseForm = this.fb.group({...DepenseCreateForm}); // Initialisation du formulaire
        }

    ngOnInit(): void {
        // Récupération de l'id du projet dans les paramètres de la route
        this.route.paramMap.subscribe(params => {
            const id = params.get('id'); // récupère l'id du projet depuis la route
            if (id) {
                this.projectId = +id; // +id pour convertir l'id en nombre
                this.loadDepenses(); // charge les dépenses du projet
            } else {
                console.error('Aucun projectId fourni dans les paramètres de la route.');
            }
        });
        this.loadLibeles(); // chargement des libellés dans le dropdown
        this.loadOrganismes(); // chargement des organismes dans le dropdown
    }

    /**
     * Charge les dépenses liées au projet.
     */
    loadDepenses(): void {
        this.depenseService.getDepensesByProjectId(this.projectId).subscribe((depenses) => {
            this.depenses = depenses.sort(
                (a, b) => new Date(b.dateFacturation).getTime() - new Date(a.dateFacturation).getTime() // Tri par date de facturation décroissante
            );
        });
    }

    /**
     * Charge les libellés pour le formulaire.
     */
    loadLibeles() {
        this.depenseService.getLibeles().subscribe((libeles) => {
            this.libeles = libeles;
        });
    }

    /**
     * Charge les organismes pour le formulaire.
     */
    loadOrganismes() {
        this.depenseService.getOrganismes().subscribe((organismes) => {
            this.organismes = organismes;
        });
    }

    /**
     * Ouvre le formulaire d'ajout d'une dépense.
     */
    openAddDepenseForm() {
        this.depenseForm.reset();
        this.displayForm = true;
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
    submitDepense() {
        if (this.depenseForm.invalid) {
            this.depenseForm.markAllAsTouched(); // Marque tous les champs comme touchés pour afficher les erreurs
            return;
        }

        // Récupération des valeurs du formulaire
        const formValue = this.depenseForm.value;

        const newDepense: CreateDepenseDTO = { // Création de l'objet de dépense à envoyer au serveur
            projectId: this.projectId,
            libeleId: formValue.libeleId,
            organismeId: formValue.organismeId,
            montant: formValue.montant,
            dateIntervention: formValue.dateIntervention ? formValue.dateIntervention.toISOString() : null,
            dateFacturation: formValue.dateFacturation ? formValue.dateFacturation.toISOString() : null,
            motif: formValue.motif, // motif facultatif
        };

        this.depenseService.addDepense(newDepense).subscribe((depense) => { // Appelle le service pour ajouter la dépense
            this.depenses.push(depense); // Ajoute la dépense dans la liste locale
            this.displayForm = false;
            this.depenseForm.reset(); // Réinitialise le formulaire
        });
    }
}
