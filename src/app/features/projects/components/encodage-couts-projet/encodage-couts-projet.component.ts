import {Component, OnInit} from '@angular/core';
import {Depense} from '../../models/project.model';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-encodage-couts-projet',
  templateUrl: './encodage-couts-projet.component.html',
  styleUrl: './encodage-couts-projet.component.scss'
})
export class EncodageCoutsProjetComponent implements OnInit {

    depenses: Depense [] = [];

    constructor(private projectService: ProjectService) {
    }

    ngOnInit(): void {
        this.loadDepenses();
    }

    loadDepenses(): void {
        this.projectService.getDepensesByProject().subscribe((depenses) => {
            this.depenses = depenses;
        });
    }
}
