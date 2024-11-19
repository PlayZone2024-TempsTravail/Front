import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './layout/header/header.component';
import { HomeComponent } from './features/home/home.component';
import { AuthModule } from './features/auth/auth.module';

import {provideHttpClient} from '@angular/common/http'; 
import { TimeTrackingModule } from './features/time-tracking/time-tracking.module';
import { TimeTrackingRoutingModule } from './features/time-tracking/time-tracking-routing.module';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { tokenInterceptor } from './interceptors/token.interceptor';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ReactiveFormsModule,
        AuthModule,
        TimeTrackingModule,
        TimeTrackingRoutingModule
    ],
    providers: [
        provideHttpClient() // Ajout de l'interceptors => provideHttpClient(withInterceptors([tokenInterceptor]))
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
