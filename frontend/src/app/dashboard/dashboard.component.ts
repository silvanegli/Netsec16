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
    public title: string;

    constructor(
        private apiService: ApiService
    ) {
    }

    ngOnInit() {
        this.apiService.getMessages().subscribe(
            (messages: Message[]) => {
                console.log(messages);
            },
            (error: any) => {
                console.log(error);
            }
        )
    }

    private onSendMessage(): void {
        let message: Message;
        message.text = this.text;
        message.title = this.title;
        this.apiService.sendMessage(message).subscribe(
            (message: Message) => (
                console.log(message)
            ),
            (error: any) => {
                console.log(error);
            }
        );
    }
}
