import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class AuthService {
    private readonly http;
    loggedInSubject: EventEmitter<boolean>;
    isLoggedIn: boolean;
    url: string;
    constructor(http: HttpClient);
    getLoggedUserToken(): string;
    static ɵfac: i0.ɵɵFactoryDef<AuthService, never>;
    static ɵprov: i0.ɵɵInjectableDef<AuthService>;
}
//# sourceMappingURL=auth.service.d.ts.map