import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class AuthorizeInterceptor implements HttpInterceptor {
    params: any;
    dialog: MatDialog;
    constructor(params: any, dialog: MatDialog);
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>;
    static ɵfac: i0.ɵɵFactoryDef<AuthorizeInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDef<AuthorizeInterceptor>;
}
//# sourceMappingURL=authorize.interceptor.d.ts.map