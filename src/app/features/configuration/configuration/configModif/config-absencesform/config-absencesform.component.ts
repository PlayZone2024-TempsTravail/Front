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


    isActiveChose : any = []
    selectedIsActive : any = []
    AbsenceModif: ConfigurationAbsenceWithOutId = {
        isActive: true ,
        abreviation: "" ,
        name: "" ,
        color: "" ,

    };
    idcheck:number = 0;

    constructor(private configurationServices:ConfigurationService ) { }


    ngOnInit(): void {
        this.configurationServices.getWorktimeCategory().subscribe(c => {
            this.configAbsences = c;
        })
        this.isActiveChose =[
            {name: "actif" , code: true},
            {name: "Inactif" , code: false}
        ]

    }

    showDialog(name: string , abreviation:string , color:string , id:number , activeChose:boolean): void {
        this.visible = true;
        this.abreviationModif = abreviation;
        this.nameModif = name;
        this.colorModif = "#" + color.toLowerCase().substring(0, color.length - 2);
        this.idcheck = id;
        this.isActiveChose = activeChose
        console.log(this.colorModif);

    }
    loadAbsences(){
        this.configurationServices.getWorktimeCategory().subscribe(c => {
            this.configAbsences = c;
        })
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
            this.loadAbsences()

        })

    }

    modifAbsence(name:string , abreviation:string , color:string , isactive :boolean ): void {
        let newcolor= color.slice(1).toUpperCase();
        let newAbreviation = abreviation.toUpperCase();
        this.AbsenceModif.color = newcolor + "FF";
        this.AbsenceModif.abreviation = newAbreviation;
        this.AbsenceModif.name = name;
        this.AbsenceModif.isActive = isactive;
        console.log(this.AbsenceModif ,this.idcheck );

        this.configurationServices.putWorktimeCategory(this.AbsenceModif,this.idcheck).subscribe(() => {
             console.log('enregistré !')
            this.loadAbsences()

        })
    }
}
