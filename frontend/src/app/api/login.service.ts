import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { JwtHelper } from 'angular2-jwt';
import { ApiService } from './api.service';

export const TOKEN_NAME = 'jwt';

interface Token {
    orig_iat: number;
    exp: number;
    user_id: number;
    username: string;
    email: string;
}

@Injectable()
export class LoginService {

    private helper: JwtHelper = new JwtHelper();

    /**
     * Loads the encoded token from local storage
     *
     * @returns {string}
     */
    public static loadToken(): string {
        return sessionStorage.getItem(TOKEN_NAME);
    }

    /**
     * Stores the encoded token in the session storage
     * @param tokenString
     */
    private static storeToken(tokenString: string): void {
        sessionStorage.setItem(TOKEN_NAME, tokenString);
    }

    /**
     * Deletes the stored token
     */
    private static deleteToken(): void {
        sessionStorage.removeItem(TOKEN_NAME);
    }


    public constructor(
        private apiService: ApiService
    ) {
    }

    public get isLoggedIn(): Observable<boolean> {
        return Observable.of(this.token != null);
    }

    public get username(): string {
        return this.token.username;
    }

    /**
     * Logs the user with the specified credentials in by requesting a token from the server
     *
     * @param username
     * @param password
     * @returns {Observable<void>}
     */
    public login(username: string, password: string): Observable<boolean> {
        return this.apiService.obtainToken(username, password)
            .do((data: any) => {
                LoginService.storeToken(data.token);
            })
            .catch((error: any) => {
                LoginService.deleteToken();
                return Observable.throw(error);
            });
    }

    /**
     * Helper to get the decoded token
     * @returns {Token}
     */
    private get token(): Token {
        let token = LoginService.loadToken();
        if (token == null) {
            return null;
        }
        else {
            return this.helper.decodeToken(token);
        }
    }
}