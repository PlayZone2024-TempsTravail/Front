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
export class EncodageRentreeProjetComponent implements OnInit {
    rentrees: RentreeDTO[] = [];
    libeles: LibeleDTO[] = [];
    organismes: OrganismeDTO[] = [];
    rentreeForm: FormGroup;
    displayForm: boolean = false;
    projectId!: number;

    constructor(
        private rentreeService: RentreeService,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.rentreeForm = this.fb.group({...RentreeCreateForm});
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.projectId = +id;
                this.loadRentrees();
            } else {
                console.error('Aucun projectId fourni dans les paramètres de la route.');
            }
        });
        this.loadLibeles();
        this.loadOrganismes();
    }

    /**
     * Charge les rentrées liées au projet.
     */
    loadRentrees(): void {
        this.rentreeService.getRentreesByProjectId(this.projectId).subscribe({
            next: (rentrees) => {
                this.rentrees = rentrees.sort(
                    (a, b) => new Date(b.dateFacturation).getTime() - new Date(a.dateFacturation).getTime()
                );
            },
            error: (err) => {
                console.error("Erreur chargement rentrées:", err);
            }
        });
    }

    /**
     * Charge les libellés pour le formulaire.
     */
    loadLibeles() {
        this.rentreeService.getLibeles().subscribe({
            next: (libeles) => {
                this.libeles = libeles;
            },
            error: (err) => {
                console.error("Erreur chargement libelés:", err);
            }
        });
    }

    /**
     * Charge les organismes pour le formulaire.
     */
    loadOrganismes() {
        this.rentreeService.getOrganismes().subscribe({
            next: (organismes) => {
                this.organismes = organismes;
            },
            error: (err) => {
                console.error("Erreur chargement organismes:", err);
            }
        });
    }


    /**
     * Ouvre le formulaire d'ajout d'une rentrée.
     */
    openAddRentreeForm() {
        this.rentreeForm.reset();
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
     * Soumet le formulaire d'ajout d'une rentrée.
     */
    submitRentree() {
        if (this.rentreeForm.invalid) {
            this.rentreeForm.markAllAsTouched();
            return;
        }

        const formValue = this.rentreeForm.value;
        const newRentree: RentreeCreateFormDTO = {
            idLibele: formValue.libeleId,
            idProject: this.projectId,
            idOrganisme: formValue.organismeId,
            montant: formValue.montant,
            dateFacturation: formValue.dateFacturation ? formValue.dateFacturation.toISOString() : null,
            motif: formValue.motif,
        };

        console.log('newRentree à envoyer:', newRentree);

        this.rentreeService.addRentree(newRentree).subscribe({
            next: (rentree) => {
                this.rentrees.push(rentree);
                this.displayForm = false;
                this.rentreeForm.reset();
            },
            error: (err) => {
                console.error("Erreur lors de l'ajout de la rentrée:", err);
            }
        });
    }
}
