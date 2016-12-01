import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { Logger } from './logging';
import {
     LOGIN_ENDPOINT, API_BASE_URL, MESSAGE_ENDPOINT, CSS_ENDPOINT
} from './api.config';
import { Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { DataExtractor } from './data-extractor.service';
import { Message } from '../dashboard/message';

@Injectable()
export class ApiService {
    public constructor(
        private http: AuthHttp,
        private logger: Logger,
        private dataExtractor: DataExtractor
    ) {
    }


    /**
     * Get all active certificates
     *
     * @returns {Message[]}
     */
    public getMessages(): Observable<Message[]> {
        return this.getRequest(this.fullUrl(MESSAGE_ENDPOINT))
            .map(json => json.map(
                json => new Message(json))
            );
    }

    public sendMessage(message: Message): Observable<Message> {
        return this.postRequest(this.fullUrl(MESSAGE_ENDPOINT), message)
            .map((json: any) => new Message(json));
    }

     public getColors(): Observable<any> {
        return this.getRequest(this.fullUrl(CSS_ENDPOINT))
            .map(json => {
                let sub = json.substr(json.indexOf('li'));
                let background = sub.substr(sub.indexOf('background:') + 12);
                let border = sub.substr(sub.indexOf('border:') + 8);
                let css = [];
                css[0] = border.substr(0, border.indexOf(';'));
                css[1] = background.substr(0, background.indexOf(';'));
                return css;
            });
    }


    /**
     * Obtains a JWT for the credentials provided
     *
     * @param username
     * @param password
     * @returns {Observable<string>}
     */
    public obtainToken(username: string, password: string): Observable<any> {
        let payload: any = {username, password};
        return this.postRequest(this.fullUrl(LOGIN_ENDPOINT), payload);
    }

    /**
     * Helper method for executing GET requests
     *
     * @param url
     * @param search
     * @returns {Observable<any>}
     */
    private getRequest(url: string, search?: URLSearchParams): Observable<any> {
        let headers = new Headers({
            'Accept': 'application/json'
        });
        let options = new RequestOptions({headers, search});
        return this.http.get(url, options)
            .do((response: Response) => this.logger.debug('Response from GET ' + response.url + ': ', response))
            .map((response: Response) => this.dataExtractor.extractData(response));
    }

    /**
     * Helper method for executing POST requests
     *
     * @param url
     * @param payload
     * @param search
     * @returns {Observable<any>}
     */
    private postRequest(url: string, payload: any, search?: URLSearchParams): Observable<any> {
        let headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({headers, search});
        return this.http.post(url, payload, options)
            .do((response: Response) => this.logger.debug('Response from POST ' + response.url + ': ', response))
            .map((response: Response) => this.dataExtractor.extractData(response));
    }

    /**
     * Helper to prepend the path with the API base url
     * @param path
     * @return {string}
     */
    private fullUrl(path: string): string {
        return API_BASE_URL + path;
    }
}