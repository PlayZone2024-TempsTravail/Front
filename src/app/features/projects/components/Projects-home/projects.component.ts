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
    selectedProject : Project[] = [];
    isNotSelectButton: boolean = true;



    constructor(private readonly route: ActivatedRoute,private readonly projectService: ProjectService) { }


    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.projects = data['projects'];
            console.log(data);
        });

    }

    totalPourcent(depence:number , previson:number){

        let total = ((depence / previson) - 1) * 100;
        console.log(total)
        if (Number.isNaN(total)){
            return 0;
        }
        else{

            return Math.round(total * 100) / 100;
        }

    }










}
