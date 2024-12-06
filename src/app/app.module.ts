import {LOCALE_ID, NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './layout/header/header.component';
import { AuthModule } from './features/auth/auth.module';
import { TimeTrackingModule } from './features/time-tracking/time-tracking.module';
import { TimeTrackingRoutingModule } from './features/time-tracking/time-tracking-routing.module';
import { HomeComponent } from './features/home/components/home.component';

import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import {ChipModule} from 'primeng/chip';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {ToastModule} from 'primeng/toast';
import {PanelMenuModule} from "primeng/panelmenu";
import { FooterComponent } from './layout/footer/footer.component';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { tokenInterceptor } from './interceptors/token.interceptor';

//PRIMENG
import {ButtonModule} from "primeng/button";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabelModule} from 'primeng/floatlabel';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';
import { DropdownModule } from 'primeng/dropdown';
import {DepenseService} from './features/projects/services/depense.service';
import {ChartModule} from 'primeng/chart';
import {jwtInterceptor} from './core/interceptor/jwt.interceptor';

import localeFrBe from '@angular/common/locales/fr-BE';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeFrBe);

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        FooterComponent,
    ],
    imports: [
        AppRoutingModule,
        ReactiveFormsModule,
        AuthModule,
        TimeTrackingModule,
        TimeTrackingRoutingModule,

        MatNativeDateModule,

        //PRIMENG
        BrowserModule,
        BrowserAnimationsModule,
        ButtonModule,
        InputTextModule,
        FloatLabelModule,
        DropdownModule,

        // PrimeNG
        BrowserModule,
        BrowserAnimationsModule,
        ButtonModule,
        InputTextModule,
    ],
    providers: [
        {provide: LOCALE_ID, useValue: 'fr-BE'},
        provideHttpClient(withInterceptors([jwtInterceptor])),
        DepenseService,
        provideAnimationsAsync() // Ajout de l'interceptors => provideHttpClient(withInterceptors([tokenInterceptor]))
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
