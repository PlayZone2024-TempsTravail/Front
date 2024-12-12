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
    filtreProjects : Project[] = [];
    isNotSelectButton: boolean = true;
    searchQuery : string = '';



    constructor(private readonly route: ActivatedRoute,private readonly projectService: ProjectService) { }


    ngOnInit(): void {
        this.loadProjects();

    }

    //
    loadProjects() {
        this.route.data.subscribe(data => {
            this.projects = data['projects'];
            this.sortProject()
            this.filtreProjects = [...this.projects]
        });
    }

    sortProject(){
        this.projects.sort((a,b) => Number(b.isActive) -Number (a.isActive) );
    }

    filterprojects(filter : string){
        switch(filter){
            case 'Actifs':
                this.filtreProjects =  this.projects.filter((p) => p.isActive);
                break;
            case 'Inactifs':
                this.filtreProjects =  this.projects.filter((p) => !p.isActive);
                break;
            default:
                this.filtreProjects =  [...this.projects]
        }
    }

    searchProjects(){
        this.filtreProjects = this.projects.filter((p) =>
            `${p.idProject} ${p.name} ${p.isActive} ${p.organismeName} ${p.chargeDeProjetName} `.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    mafct(monid: string) {
        document.getElementById(monid)!.click()
    }





// calcule pour la variation
    totalPourcent(previson:number , depence:number){


        if (depence == 0 || previson == 0){
            return 0;
        }
        let total = ((depence - previson)/ previson) * 100;

        return Math.round(total*100)/100;


    }

    roundprevisonDepence(item : number){
        return Math.round(item*100)/100;
    }
}
