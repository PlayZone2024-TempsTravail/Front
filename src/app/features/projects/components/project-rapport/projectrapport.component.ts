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

    date_start!: Date;
    date_end!: Date;
    listLibeles: LebeleTree[] = [];
    selectedListLibeles: LebeleTree[] = [];

// creation du rapport  et du formulaire
    extractedNumbers :number[] = [];
    rapport!: FormGroup;
    rapportToDb: RapportToDb = {
        date_start: new Date(),
        date_end: new Date(),
        projects: [],
        libeles: []
    };

    shortProjects: ShortProject[] = [];
    selectedProject: number [] = [];


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
            const nextDay = this.date_start;
            nextDay.setDate(nextDay.getDay() + 1);
            this.date_end = nextDay;
        }
    }

    newStarDate!: Date;
    newEndDate!: Date;


    send() {
        //converstion des dated

        this.rapportToDb.date_start = this.date_start
        this.rapportToDb.date_end = this.date_end
        this.rapportToDb.projects = this.selectedProject
        this.extractedNumbers = this.convertLibelleTonumber(this.selectedListLibeles)
        this.rapportToDb.libeles = this.extractedNumbers
        console.log(this.rapportToDb)

    }

    convertLibelleTonumber(selectedListLibelles: LebeleTree[]):number[] {
        const numbers: number[] = [];

        selectedListLibelles.forEach(libelle => {
            if (libelle.key.startsWith("l")) {

                numbers.push(parseInt(libelle.key.split("-")[1]))


            }
        })


        return numbers;
    }


}

