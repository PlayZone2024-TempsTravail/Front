import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from '../services/configuration.service';
import {Category, ConfigurationList} from '../models/configuration.model';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent implements OnInit {

    configs:  ConfigurationList[] = []
    categories: Category[] = []

    //forms


    constructor(private configurationServices:ConfigurationService) {
    }

    ngOnInit(): void {
        this.configurationServices.getConfiguration().subscribe(c => {
            this.configs = c;
        })
        this.configurationServices.getCategory().subscribe(c => {
            this.categories = c;
        })
    }



    modification(event:number){

    }


    protected readonly parseFloat = parseFloat;
}
