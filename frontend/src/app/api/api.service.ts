import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { Logger } from './logging';
import {
     VERIFY_ENDPOINT, LOGIN_ENDPOINT, API_BASE_URL, MESSAGE_ENDPOINT
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
        let options = new URLSearchParams();
        options.append('status', 'active');
        // return this.getRequest(this.fullUrl(CERTIFICATE_ENDPOINT), options)
        //     .map((json: any) => (new Certificate(json)));
        return Observable.of([].map((json: any) => new Message()));
    }

    public sendMessage(message: Message): Observable<Message> {
        return this.postRequest(this.fullUrl(MESSAGE_ENDPOINT), message);
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
     * Verifies the JWT
     *
     * @param token
     * @returns {Observable<boolean>}
     */
    public verifyToken(token: string): Observable<any> {
        let payload: any = {token};
        return this.postRequest(this.fullUrl(VERIFY_ENDPOINT), payload);
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