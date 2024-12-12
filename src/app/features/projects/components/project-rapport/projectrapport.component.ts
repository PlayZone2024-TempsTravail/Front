import {Component, OnInit} from '@angular/core';
import {ShortProject , RapportToDb , LebeleTree} from '../../models/projectRapport.model';
import {ProjectRapportService} from '../../services/project-rapport.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Project} from '../../models/project.model';
import { ButtonModule } from 'primeng/button';
import { ProjectService } from '../../services/project.service';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

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
    loading: boolean = false;

// creation du rapport  et du formulaire
    extractedNumbers :number[] = [];
    rapport!: FormGroup;
    rapportToDb: RapportToDb = {
        dateStart: new Date(),
        dateEnd: new Date(),
        projects: [],
        libelles: []
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
        this.loading = true; // Start the loading spinner

        this.rapportToDb.dateStart = this.date_start
        this.rapportToDb.dateEnd = this.date_end
        this.rapportToDb.projects = this.selectedProject
        this.extractedNumbers = this.convertLibelleTonumber(this.selectedListLibeles)
        this.rapportToDb.libelles = this.extractedNumbers
        console.log(this.rapportToDb)

        // Call the service to generate the report and download the file
        this.projectRapportService.createProjetRapport(this.rapportToDb).subscribe(
            (response) => {
                const url = window.URL.createObjectURL(response);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'ProjectRapport.pdf';
                a.click();
                window.URL.revokeObjectURL(url);

                // Stop the loading spinner
                this.loading = false;
            },
            (error) => {
                console.error('Error generating report:', error);
                this.loading = false; // Stop the loading spinner even if there's an error
            }
        );
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

