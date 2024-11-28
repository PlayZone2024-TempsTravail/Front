import {Component, OnInit} from '@angular/core';
import {Project} from '../../models/project.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-components',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit  {
    //list of projects
    projects: Project[] = [];

    constructor(private readonly route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.projects = data['projects'];
            console.log(data);
        });
    }
}
