import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {provideHttpClient} from '@angular/common/http'; 
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { tokenInterceptor } from './interceptors/token.interceptor';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule
    ],
    providers: [
        provideHttpClient() // Ajout de l'interceptors => provideHttpClient(withInterceptors([tokenInterceptor]))
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
