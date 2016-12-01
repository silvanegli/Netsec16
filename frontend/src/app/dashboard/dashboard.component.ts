import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Message } from './message';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    public text: string;
    public messages: Message[];
    public background: string;
    public border: string;

    constructor(
        private apiService: ApiService
    ) {
    }

    ngOnInit() {
        this.messages = [];
        this.apiService.getMessages().subscribe(
            (messages: Message[]) => {
                messages.map(
                    (message) => {
                        this.messages.push(message);
                    }
                );
            },
            (error: any) => {
                console.log(error);
            }
        )
    }

    public onSendMessage(): void {
        this.apiService.sendMessage({'text': this.text}).subscribe(
            (message: Message) => {
                this.messages.push(message);
                this.text = '';
                this.reloadCSS();
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    private reloadCSS(): void {
        this.apiService.getColors().subscribe(
            (css: any) => {
                this.border = css[0];
                this.background = css[1];
            },
            (error: any) => (console.log(error))
        );
    }
}
