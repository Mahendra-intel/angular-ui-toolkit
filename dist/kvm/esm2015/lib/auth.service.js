import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class AuthService {
    constructor(http) {
        this.http = http;
        this.loggedInSubject = new EventEmitter(false);
        this.isLoggedIn = false;
        this.url = `${environment.mpsServer}/api/v1/authorize`;
        if (localStorage.loggedInUser != null) {
            this.isLoggedIn = true;
            this.loggedInSubject.next(this.isLoggedIn);
        }
        if (environment.mpsServer.includes('/mps')) {
            // handles kong route
            this.url = `${environment.mpsServer}/login/api/v1/authorize`;
        }
    }
    getLoggedUserToken() {
        const loggedUser = localStorage.getItem('loggedInUser');
        const token = JSON.parse(loggedUser).token;
        return token;
    }
}
AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(i0.ɵɵinject(i1.HttpClient)); };
AuthService.ɵprov = i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'platform' });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthService, [{
        type: Injectable,
        args: [{
                providedIn: 'platform',
            }]
    }], function () { return [{ type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMva3ZtL3NyYy9saWIvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7O0FBSzFELE1BQU0sT0FBTyxXQUFXO0lBS3RCLFlBQTZCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7UUFKN0Msb0JBQWUsR0FBMEIsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFDMUUsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixRQUFHLEdBQVcsR0FBRyxXQUFXLENBQUMsU0FBUyxtQkFBbUIsQ0FBQztRQUd4RCxJQUFJLFlBQVksQ0FBQyxZQUFZLElBQUksSUFBSSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM1QztRQUNELElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDMUMscUJBQXFCO1lBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUMsU0FBUyx5QkFBeUIsQ0FBQztTQUM5RDtJQUNILENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsTUFBTSxVQUFVLEdBQVEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3RCxNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNuRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7O3NFQXBCVSxXQUFXO21EQUFYLFdBQVcsV0FBWCxXQUFXLG1CQUZWLFVBQVU7dUZBRVgsV0FBVztjQUh2QixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLFVBQVU7YUFDdkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdwbGF0Zm9ybScsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XHJcbiAgbG9nZ2VkSW5TdWJqZWN0OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcclxuICBpc0xvZ2dlZEluID0gZmFsc2U7XHJcbiAgdXJsOiBzdHJpbmcgPSBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXJ9L2FwaS92MS9hdXRob3JpemVgO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIGlmIChsb2NhbFN0b3JhZ2UubG9nZ2VkSW5Vc2VyICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5pc0xvZ2dlZEluID0gdHJ1ZTtcclxuICAgICAgdGhpcy5sb2dnZWRJblN1YmplY3QubmV4dCh0aGlzLmlzTG9nZ2VkSW4pO1xyXG4gICAgfVxyXG4gICAgaWYgKGVudmlyb25tZW50Lm1wc1NlcnZlci5pbmNsdWRlcygnL21wcycpKSB7XHJcbiAgICAgIC8vIGhhbmRsZXMga29uZyByb3V0ZVxyXG4gICAgICB0aGlzLnVybCA9IGAke2Vudmlyb25tZW50Lm1wc1NlcnZlcn0vbG9naW4vYXBpL3YxL2F1dGhvcml6ZWA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRMb2dnZWRVc2VyVG9rZW4oKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGxvZ2dlZFVzZXI6IGFueSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2dnZWRJblVzZXInKTtcclxuICAgIGNvbnN0IHRva2VuOiBzdHJpbmcgPSBKU09OLnBhcnNlKGxvZ2dlZFVzZXIpLnRva2VuO1xyXG4gICAgcmV0dXJuIHRva2VuO1xyXG4gIH1cclxufVxyXG4iXX0=