import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { routing } from './app.routing';
import { Logger } from './api/logging';
import { ApiModule } from './api/api.module';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
    declarations: [
        AppComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        ApiModule,
        LoginModule,
        DashboardModule,
    ],
    providers: [
        Logger
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
