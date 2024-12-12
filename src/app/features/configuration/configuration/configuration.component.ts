import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from '../services/configuration.service';
import {Category, ConfigurationList} from '../models/configuration.model';
import { Toast } from 'primeng/toast';
import {MessageService} from 'primeng/api';
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent implements OnInit {

    configs:  ConfigurationList[] = []
    categories: Category[] = []
    configsSelect:  ConfigurationList[] = []
    //forms

    constructor(private configurationServices:ConfigurationService , private messageService: MessageService  ) {}

    ngOnInit(): void {
        this.configurationServices.getConfiguration().subscribe(c => {
            this.configs = c;
        })
        this.configurationServices.getCategory().subscribe(c => {
            this.categories = c;
        })



    }

    saveData(value: string , name : string ) {
        const newItem: ConfigurationList = { parameterName: name, parameterValue: value };

        if (this.isValidNumber(value)){
            this.configurationServices.postConfiguration(newItem).subscribe(() => {
                console.log(`${name} ${value} enregistré`);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `${value} enregistré` });
            });

        }else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Saisissez un nombre avec ou sans une virgule ' });
        }

    }

    isValidNumber(inputText: string): boolean {
        const pattern = /^\d+(\,\d+)?$/;
        return pattern.test(inputText);
    }
}

