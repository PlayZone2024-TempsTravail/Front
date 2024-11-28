import {Component, OnInit} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../../models/project.model';

@Component({
  selector: 'app-voir-graphique',
  templateUrl: './voir-graphique.component.html',
  styleUrl: './voir-graphique.component.scss'
})
export class VoirGraphiqueComponent implements OnInit  {
    //list of projects
    @Input() projects: Depense = [];

    constructor(private readonly route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.projects = data['projects'];
            console.log(data);
        });
    }

}
