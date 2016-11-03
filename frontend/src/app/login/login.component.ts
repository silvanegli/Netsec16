import { Component } from '@angular/core';
import { LoginService } from '../api/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    public username: string;
    public password: string;

    constructor(
        private loginService: LoginService,
        private router: Router
    ) {
    }

    onSubmit() {
        this.loginService.login(this.username, this.password)
            .subscribe(
                () => {
                    this.router.navigate(['/']);
                },
                (error: any) => {
                    console.log(error);
                }
            )
    }
}
