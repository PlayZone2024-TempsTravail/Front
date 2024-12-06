import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './features/auth/services/auth.services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'PlayZone2024_TempsDeTravail';

    isLoggedIn: boolean = false;

    constructor(private authService: AuthService, private router: Router) {
            this.authService.currentUser$.subscribe(user => {
            this.isLoggedIn = !!user;
        });
    }

    handleAuthAction(): void {
        if (this.isLoggedIn) {
            this.authService.logout(); 
            this.router.navigate(['/login']);
        } else {
            this.router.navigate(['/login']);
        }
    }
}
