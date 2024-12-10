import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigurationService} from '../../../services/configuration.service';
import {ConfigurationAbsence} from '../../../models/configurationAbsence.model';

@Component({
  selector: 'app-config-absencesform',
  templateUrl: './config-absencesform.component.html',
  styleUrl: './config-absencesform.component.scss'
})
export class ConfigAbsencesformComponent implements OnInit {

    configAbsences: ConfigurationAbsence[] = [];
    Newabreviation: string = "";
    NewName: string = "";

    constructor(private configurationServices:ConfigurationService ) { }


    ngOnInit(): void {
        this.configurationServices.getWorktimeCategory().subscribe(c => {
            this.configAbsences = c;
        })
    }

}
