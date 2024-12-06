import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './features/auth/services/auth.services';
import {PrimeNGConfig} from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'PlayZone2024_TempsDeTravail';

    isLoggedIn: boolean = false;

    constructor(private authService: AuthService, private router: Router, private primeConfig: PrimeNGConfig) {
        this.authService.currentUser$.subscribe(user => {
            this.isLoggedIn = !!user;
        });
    }

    ngOnInit() {
        // Configuration de la locale des composants PrimeNG
        this.primeConfig.setTranslation({
            dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
            monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            monthNamesShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
            today: 'Aujourd\'hui',
            clear: 'Effacer',
            dateFormat: 'dd/mm/yy',
            weekHeader: 'Semaine',
            firstDayOfWeek: 1, // début de la semaine à lundi
        })
    }

    handleAuthAction(): void {
        if (this.isLoggedIn) {
            this.authService.logout();
        } else {
            this.router.navigate(['/login']);
        }
    }
}
