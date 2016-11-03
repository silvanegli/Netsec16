import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { routing } from './dashboard.routing';
import { ApiModule } from '../api/api.module';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        routing,
        FormsModule,
        ApiModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}