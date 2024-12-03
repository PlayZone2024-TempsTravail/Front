import {Component, OnInit} from '@angular/core';
import {Depense} from '../../models/project.model';
import {ProjectService} from '../../services/project.service';
import {DepenseDTO, LibeleDTO, ProjectDTO} from '../../models/depense.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DepenseService} from '../../services/depense.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-encodage-couts-projet',
  templateUrl: './encodage-couts-projet.component.html',
  styleUrl: './encodage-couts-projet.component.scss'
})
export class EncodageCoutsProjetComponent implements OnInit {

    depenses: DepenseDTO[] = [];
    libeles: LibeleDTO[] = [];
    projects: ProjectDTO[] = [];
    depenseForm: FormGroup;
    displayForm: boolean = false;

    // ID du projet (à remplacer par une valeur dynamique plus tard)
    projectId: number = 1;

    constructor(
        private depenseService: DepenseService,
        private fb: FormBuilder
    ) {
        this.depenseForm = this.fb.group({
            libeleId: [null, Validators.required],
            organismeId: [null, Validators.required],
            motif: [null, Validators.required],
            montant: [null, [Validators.required, Validators.min(0)]],
            dateIntervention: [null, Validators.required],
            dateFacturation: [null, Validators.required],
        });
    }

    ngOnInit(): void {
        this.loadDepenses();
        this.loadLibeles();
    }

    loadDepenses(): void {
        this.depenseService.getDepensesByProjectId(this.projectId).subscribe((depenses) => {
            this.depenses = depenses;
        });
    }

    loadLibeles() {
        this.depenseService.getLibeles().subscribe((libeles) => {
            this.libeles = libeles;
        });
    }

    openAddDepenseForm() {
        this.depenseForm.reset();
        this.displayForm = true;
    }

    getLibeleName(idLibele: number): string {
        const libele = this.libeles.find((l) => l.idLibele === idLibele);
        return libele ? libele.name || '' : '';
    }

    getNameProject(idProject: number): string {
        const project = this.projects.find((p) => p.idProject === idProject);
        return project ? project.name || '' : '';
    }


    submitDepense() {
        if (this.depenseForm.invalid) {
            this.depenseForm.markAllAsTouched();
            return;
        }

        const newDepense: DepenseDTO = {
            idDepense: this.generateDepenseId(),
            projectId: this.projectId,
            ...this.depenseForm.value,
        };

        // Ajouter la nouvelle dépense
        this.depenseService.addDepense(newDepense).subscribe((depense) => {
            this.depenses.push(depense);
            this.displayForm = false;
        });
    }



    private generateDepenseId(): number {
        // Générer un nouvel ID pour la dépense (json-server ne le fait pas automatiquement pour les objets imbriqués)
        if (this.depenses.length > 0) {
            return Math.max(...this.depenses.map((d) => d.idDepense)) + 1;
        } else {
            return 1;
        }
    }
}
