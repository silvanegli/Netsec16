import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { JwtHelper } from 'angular2-jwt';
import { Logger } from './logging';
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
        let tokenString = localStorage.getItem(TOKEN_NAME);
        if (tokenString == null) {
            tokenString = sessionStorage.getItem(TOKEN_NAME);
        }
        return tokenString;
    }

    /**
     * Stores the encoded token in the local storage (permanent == true) or the session storage (permanent == false)
     * @param tokenString
     * @param permanent
     */
    private static storeToken(tokenString: string, permanent: boolean = true): void {
        if (permanent) {
            sessionStorage.removeItem(TOKEN_NAME);
            localStorage.setItem(TOKEN_NAME, tokenString);
        }
        else {
            localStorage.removeItem(TOKEN_NAME);
            sessionStorage.setItem(TOKEN_NAME, tokenString);
        }
    }

    /**
     * Deletes the stored token
     */
    private static deleteToken(): void {
        localStorage.removeItem(TOKEN_NAME);
        sessionStorage.removeItem(TOKEN_NAME);
    }


    public constructor(
        private logger: Logger,
        private apiService: ApiService
    ) { }

    public get isLoggedIn(): Observable<boolean> {
        console.log(this.token);
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
     * @param keepLoggedIn
     * @returns {Observable<void>}
     */
    public login(username: string, password: string, keepLoggedIn: boolean = true): Observable<boolean> {
        return this.apiService.obtainToken(username, password)
            .do((data: any) => {
                LoginService.storeToken(data.token, keepLoggedIn);
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