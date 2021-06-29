import { HttpResponse, HttpErrorResponse, } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DialogContentComponent } from './shared/dialog-content/dialog-content.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
export class AuthorizeInterceptor {
    constructor(params, dialog) {
        this.params = params;
        this.dialog = dialog;
    }
    intercept(request, next) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.params.authToken}`,
            },
        });
        return next.handle(request).pipe(tap((data) => {
            if (data instanceof HttpResponse) {
                return data;
            }
            return null;
        }, (error) => {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) {
                    this.dialog.open(DialogContentComponent, {
                        data: { name: 'session time out. Please login again' },
                    });
                }
            }
            return throwError(error);
        }));
    }
}
AuthorizeInterceptor.ɵfac = function AuthorizeInterceptor_Factory(t) { return new (t || AuthorizeInterceptor)(i0.ɵɵinject('userInput'), i0.ɵɵinject(i1.MatDialog)); };
AuthorizeInterceptor.ɵprov = i0.ɵɵdefineInjectable({ token: AuthorizeInterceptor, factory: AuthorizeInterceptor.ɵfac });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthorizeInterceptor, [{
        type: Injectable
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: ['userInput']
            }] }, { type: i1.MatDialog }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXplLmludGVyY2VwdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMva3ZtL3NyYy9saWIvYXV0aG9yaXplLmludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFLTCxZQUFZLEVBQ1osaUJBQWlCLEdBQ2xCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbkQsT0FBTyxFQUFjLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0RBQWtELENBQUM7OztBQUcxRixNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLFlBQzhCLE1BQU0sRUFDM0IsTUFBaUI7UUFESSxXQUFNLEdBQU4sTUFBTSxDQUFBO1FBQzNCLFdBQU0sR0FBTixNQUFNLENBQVc7SUFDdkIsQ0FBQztJQUNKLFNBQVMsQ0FDUCxPQUE2QixFQUM3QixJQUFpQjtRQUVqQixPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUN0QixVQUFVLEVBQUU7Z0JBQ1YsYUFBYSxFQUFFLFVBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7YUFDakQ7U0FDRixDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUM5QixHQUFHLENBQ0QsQ0FBQyxJQUFTLEVBQUUsRUFBRTtZQUNaLElBQUksSUFBSSxZQUFZLFlBQVksRUFBRTtnQkFDaEMsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxFQUNELENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDYixJQUFJLEtBQUssWUFBWSxpQkFBaUIsRUFBRTtnQkFDdEMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUU7d0JBQ3ZDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxzQ0FBc0MsRUFBRTtxQkFDdkQsQ0FBQyxDQUFDO2lCQUNKO2FBQ0Y7WUFDRCxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQzs7d0ZBbENVLG9CQUFvQixjQUVyQixXQUFXOzREQUZWLG9CQUFvQixXQUFwQixvQkFBb0I7dUZBQXBCLG9CQUFvQjtjQURoQyxVQUFVOztzQkFHTixNQUFNO3VCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIEh0dHBFdmVudCxcclxuICBIdHRwSW50ZXJjZXB0b3IsXHJcbiAgSHR0cEhhbmRsZXIsXHJcbiAgSHR0cFJlcXVlc3QsXHJcbiAgSHR0cFJlc3BvbnNlLFxyXG4gIEh0dHBFcnJvclJlc3BvbnNlLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1hdERpYWxvZyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBEaWFsb2dDb250ZW50Q29tcG9uZW50IH0gZnJvbSAnLi9zaGFyZWQvZGlhbG9nLWNvbnRlbnQvZGlhbG9nLWNvbnRlbnQuY29tcG9uZW50JztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEF1dGhvcml6ZUludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIEBJbmplY3QoJ3VzZXJJbnB1dCcpIHB1YmxpYyBwYXJhbXMsXHJcbiAgICBwdWJsaWMgZGlhbG9nOiBNYXREaWFsb2dcclxuICApIHt9XHJcbiAgaW50ZXJjZXB0KFxyXG4gICAgcmVxdWVzdDogSHR0cFJlcXVlc3Q8dW5rbm93bj4sXHJcbiAgICBuZXh0OiBIdHRwSGFuZGxlclxyXG4gICk6IE9ic2VydmFibGU8SHR0cEV2ZW50PHVua25vd24+PiB7XHJcbiAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XHJcbiAgICAgIHNldEhlYWRlcnM6IHtcclxuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dGhpcy5wYXJhbXMuYXV0aFRva2VufWAsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KS5waXBlKFxyXG4gICAgICB0YXAoXHJcbiAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBIdHRwUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIChlcnJvcjogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBIdHRwRXJyb3JSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICB0aGlzLmRpYWxvZy5vcGVuKERpYWxvZ0NvbnRlbnRDb21wb25lbnQsIHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IHsgbmFtZTogJ3Nlc3Npb24gdGltZSBvdXQuIFBsZWFzZSBsb2dpbiBhZ2FpbicgfSxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19