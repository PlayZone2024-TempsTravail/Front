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

    depenses: DepenseDTO[] = [];
    libeles: LibeleDTO[] = [];
    organismes: OrganismeDTO[] = [];
    depenseForm: FormGroup; // formulaire de création de dépense
    displayForm: boolean = false;
    projectId!: number;

    constructor(
        private depenseService: DepenseService,
        private fb: FormBuilder,
        private route: ActivatedRoute // pour récupérer les paramètres de la route
    ) {
            this.depenseForm = this.fb.group({...DepenseCreateForm});
        }

    ngOnInit(): void {
        // Récupération de l'id du projet dans les paramètres de la route
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.projectId = +id; // +id pour convertir l'id en nombre
                this.loadDepenses();
            } else {
                console.error('Aucun projectId fourni dans les paramètres de la route.');
            }
        });
        this.loadLibeles(); // chargement des libellés dans le dropdown
        this.loadOrganismes(); // chargement des organismes dans le dropdown
    }

    // Récupération des dépenses du projet
    loadDepenses(): void {
        this.depenseService.getDepensesByProjectId(this.projectId).subscribe((depenses) => {
            this.depenses = depenses;
        });
    }

    // Récupération des libellés
    loadLibeles() {
        this.depenseService.getLibeles().subscribe((libeles) => {
            this.libeles = libeles;
        });
    }

    // Récupération des organismes
    loadOrganismes() {
        this.depenseService.getOrganismes().subscribe((organismes) => {
            this.organismes = organismes;
        });
    }

    // Ouverture du formulaire de création de dépense
    openAddDepenseForm() {
        this.depenseForm.reset();
        this.displayForm = true;
    }

    // Récupération du nom des libellés  par rapport à leur id fourni
    getLibeleName(idLibele: number): string {
        const libele = this.libeles.find((l) => l.idLibele === idLibele);
        return libele ? libele.name || '' : '';
    }

    // Récupération du nom des organismes par rapport à leur id fourni
    getOrganismeName(idOrganisme: number): string {
        const organisme = this.organismes.find((o) => o.idOrganisme === idOrganisme);
        return organisme ? organisme.name || '' : '';
    }

    // Soumission du formulaire de création de dépense
    submitDepense() {
        if (this.depenseForm.invalid) {
            this.depenseForm.markAllAsTouched();
            return;
        }

        // Récupération des valeurs du formulaire
        const formValue = this.depenseForm.value;
        // Création de l'objet de dépense à envoyer au serveur
        const newDepense: CreateDepenseDTO = {
            projectId: this.projectId,
            libeleId: formValue.libeleId,
            organismeId: formValue.organismeId,
            montant: formValue.montant,
            dateIntervention: formValue.dateIntervention ? formValue.dateIntervention.toISOString() : null, // conversion de la date en string
            dateFacturation: formValue.dateFacturation ? formValue.dateFacturation.toISOString() : null, // conversion de la date en string
            motif: formValue.motif,
        };

        // Appel du service pour créer la dépense
        this.depenseService.addDepense(newDepense).subscribe((depense) => {
            this.depenses.push(depense); // ajout de la dépense à la liste
            this.displayForm = false;
            this.depenseForm.reset(); // réinitialisation du formulaire
        });
    }
}
