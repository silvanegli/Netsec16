export class Message {
    text: string;
    date?: string;
    writer?: string;


    constructor(json: any) {
        this.text = json.text;
        this.date = json.created_at;
        this.writer = json.writer;
    }
}