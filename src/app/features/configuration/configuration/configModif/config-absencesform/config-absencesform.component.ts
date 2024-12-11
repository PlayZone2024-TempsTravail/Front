import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigurationService} from '../../../services/configuration.service';
import {ConfigurationAbsence, ConfigurationAbsenceWithOutId} from '../../../models/configurationAbsence.model';

@Component({
  selector: 'app-config-absencesform',
  templateUrl: './config-absencesform.component.html',
  styleUrl: './config-absencesform.component.scss'
})
export class ConfigAbsencesformComponent implements OnInit {

    configAbsences: ConfigurationAbsence[] = [];
    Newabreviation: string = "";
    NewName: string = "";
    Newcolor: string = "#84c101";

    newAbsence: ConfigurationAbsenceWithOutId = {
        isActive: true ,
        abreviation: "" ,
        name: "" ,
        color: "" ,

    };

    //P-dialog
    visible: boolean = false;
    abreviationModif: string = "";
    nameModif: string = "";
    colorModif: string = "";

    AbsenceModif: ConfigurationAbsenceWithOutId = {
        isActive: true ,
        abreviation: "" ,
        name: "" ,
        color: "" ,

    };

    constructor(private configurationServices:ConfigurationService ) { }


    ngOnInit(): void {
        this.configurationServices.getWorktimeCategory().subscribe(c => {
            this.configAbsences = c;
        })

    }

    showDialog(name: string , abreviation:string , color:string): void {
        this.visible = true;
        this.abreviationModif = abreviation;
        this.nameModif = name;
        this.colorModif = "#" + color.toLowerCase().substring(0, color.length - 2);
        console.log(this.colorModif);

    }


    seeColor(color:string):string {

        return "#" + color;
    }
    sendNewAbsences(name:string , abreviation:string , color:string): void {

        // converstion de la couleur pour la db
        let newcolor= color.slice(1).toUpperCase();
        let newAbreviation = abreviation.toUpperCase();

        this.newAbsence.color = newcolor + "FF";
        this.newAbsence.abreviation = newAbreviation;
        this.newAbsence.name = name;
        console.log(this.newAbsence);
        this.configurationServices.postWorktimeCategory(this.newAbsence).subscribe(() => {
            console.log('enregistré !')
        })

    }

    modifAbsence(name:string , abreviation:string , color:string){
        let newcolor= color.slice(1).toUpperCase();
        let newAbreviation = abreviation.toUpperCase();

        this.AbsenceModif.color = newcolor + "FF";
        this.AbsenceModif.abreviation = newAbreviation;
        this.AbsenceModif.name = name;
        console.log(this.AbsenceModif);

        this.configurationServices.putWorktimeCategory(this.newAbsence).subscribe(() => {
             console.log('enregistré !')
        })
    }
}
