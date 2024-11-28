import {Component, OnInit} from '@angular/core';
import {Project} from '../../models/project.model';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {UserInMisson} from '../../models/userProject.model';

@Component({
  selector: 'app-components',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit  {
    //list of projects
    projects: Project[] = [];
    usersInMisson : UserInMisson[] = [];


    constructor(private readonly route: ActivatedRoute,private readonly projectService: ProjectService) { }


    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.projects = data['projects'];
            console.log(data);
        });

    }








}
