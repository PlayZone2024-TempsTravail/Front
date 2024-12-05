import {Component, OnInit} from '@angular/core';
import {ShortProject , RapportToDb , LebeleTree} from '../../models/projectRapport.model';
import {ProjectRapportService} from '../../services/project-rapport.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Project} from '../../models/project.model';

@Component({
  selector: 'app-project-rapport',
  templateUrl: './projectrapport.component.html',
  styleUrl: './projectrapport.component.scss'
})
export class ProjectrapportComponent implements OnInit {

    // creation des varable du formulaire

    date_start: Date | null = null;
    date_end: Date | null = null;
    listLibeles: LebeleTree[] = [];

// creation du rapport  et du formulaire
    rapport!: FormGroup;
    rapportToDb : RapportToDb[] = []
    shortProjects: ShortProject[] = [];
    selectedProject: string [] = [];


    constructor(private fb: FormBuilder , private projectRapportService: ProjectRapportService) { }


    ngOnInit(): void {
      this.rapport = this.fb.group({
          date_start :['',[Validators.required ]],
          date_end : ['',[Validators.required ]],


      })
        this.projectRapportService.getShortProject().subscribe(p =>{
            this.shortProjects = p;
        })

        this.projectRapportService.getLibele().subscribe(l =>{
            this.listLibeles = l;
        })
    }

    onDateStartChange(event: any) {
        this.date_start = event;
        if (this.date_start) {
            const nextDay = new Date(this.date_start);
            nextDay.setDate(nextDay.getMonth() + 1);
            this.date_end = nextDay;
        }
    }




    send(){
        console.log("ok cool mec ")
        console.log(this.selectedProject)
        console.log(this.date_start)
    }

}

//TODO creation du tree dans le html (voir primeng Checkbox)
//TODO faire le form
//TODO creation de l'ago pour envoyer au post le bon fichier json
