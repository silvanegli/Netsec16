import { NgModule, SkipSelf, Optional, ModuleWithProviders } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { TOKEN_NAME, LoginService } from './login.service';
import { DataExtractor } from './data-extractor.service';
import { AuthGuard } from './auth-guard.service';
import { NotAuthGuard } from './not-auth.guard.service';
import { API_BASE_URL } from './api.config';
import { ApiService } from './api.service';

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: (http: Http): AuthHttp => {
                return new AuthHttp(new AuthConfig({
                    tokenName: TOKEN_NAME,
                    tokenGetter: () => Promise.resolve(LoginService.loadToken()),
                    headerPrefix: 'JWT',
                    noJwtError: true
                }), http);
            },
            deps: [Http]
        },
        ApiService,
        DataExtractor,
        LoginService,
        NotAuthGuard,
        AuthGuard
    ]
})
export class ApiModule {
    public static forRoot(apiBaseUrl: string): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [
                {provide: API_BASE_URL, useValue: apiBaseUrl}
            ]
        };
    }

    public constructor(@Optional() @SkipSelf() private parentModule: ApiModule) {
        if (parentModule) {
            throw new Error(
                'ApiModule is already loaded. Import it in the AppModule only'
            );
        }
    }
}