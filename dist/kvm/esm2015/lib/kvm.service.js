import { EventEmitter, Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class KvmService {
    constructor(http) {
        this.http = http;
        this.connectKVMSocket = new EventEmitter(false);
        this.stopwebSocket = new EventEmitter(false);
    }
    setAmtFeatures(deviceId) {
        const payload = {
            userConsent: 'none',
            enableKVM: true,
            enableSOL: true,
            enableIDER: true,
        };
        return this.http
            .post(`${environment.mpsServer}/api/v1/amt/features/${deviceId}`, payload)
            .pipe(catchError((err) => {
            throw err;
        }));
    }
    getPowerState(deviceId) {
        return this.http
            .get(`${environment.mpsServer}/api/v1/amt/power/state/${deviceId}`)
            .pipe(catchError((err) => {
            throw err;
        }));
    }
    sendPowerAction(deviceId, action, useSOL = false) {
        const payload = {
            method: 'PowerAction',
            action,
            useSOL,
        };
        return this.http
            .post(`${environment.mpsServer}/api/v1/amt/power/action/${deviceId}`, payload)
            .pipe(catchError((err) => {
            throw err;
        }));
    }
}
KvmService.ɵfac = function KvmService_Factory(t) { return new (t || KvmService)(i0.ɵɵinject(i1.HttpClient)); };
KvmService.ɵprov = i0.ɵɵdefineInjectable({ token: KvmService, factory: KvmService.ɵfac, providedIn: 'platform' });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmService, [{
        type: Injectable,
        args: [{
                providedIn: 'platform',
            }]
    }], function () { return [{ type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7QUFNMUQsTUFBTSxPQUFPLFVBQVU7SUFJckIsWUFBNkIsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUg3QyxxQkFBZ0IsR0FBMEIsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFDM0Usa0JBQWEsR0FBMEIsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7SUFFeEIsQ0FBQztJQUVqRCxjQUFjLENBQUMsUUFBZ0I7UUFDN0IsTUFBTSxPQUFPLEdBQUc7WUFDZCxXQUFXLEVBQUUsTUFBTTtZQUNuQixTQUFTLEVBQUUsSUFBSTtZQUNmLFNBQVMsRUFBRSxJQUFJO1lBQ2YsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLElBQUk7YUFDYixJQUFJLENBQ0gsR0FBRyxXQUFXLENBQUMsU0FBUyx3QkFBd0IsUUFBUSxFQUFFLEVBQzFELE9BQU8sQ0FDUjthQUNBLElBQUksQ0FDSCxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNqQixNQUFNLEdBQUcsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDTixDQUFDO0lBQ0QsYUFBYSxDQUFDLFFBQWdCO1FBQzVCLE9BQU8sSUFBSSxDQUFDLElBQUk7YUFDYixHQUFHLENBQ0YsR0FBRyxXQUFXLENBQUMsU0FBUywyQkFBMkIsUUFBUSxFQUFFLENBQzlEO2FBQ0EsSUFBSSxDQUNILFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sR0FBRyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNOLENBQUM7SUFDRCxlQUFlLENBQ2IsUUFBZ0IsRUFDaEIsTUFBYyxFQUNkLFNBQWtCLEtBQUs7UUFFdkIsTUFBTSxPQUFPLEdBQUc7WUFDZCxNQUFNLEVBQUUsYUFBYTtZQUNyQixNQUFNO1lBQ04sTUFBTTtTQUNQLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxJQUFJO2FBQ2IsSUFBSSxDQUNILEdBQUcsV0FBVyxDQUFDLFNBQVMsNEJBQTRCLFFBQVEsRUFBRSxFQUM5RCxPQUFPLENBQ1I7YUFDQSxJQUFJLENBQ0gsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDakIsTUFBTSxHQUFHLENBQUM7UUFDWixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ04sQ0FBQzs7b0VBdkRVLFVBQVU7a0RBQVYsVUFBVSxXQUFWLFVBQVUsbUJBRlQsVUFBVTt1RkFFWCxVQUFVO2NBSHRCLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsVUFBVTthQUN2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBBbXRGZWF0dXJlc1Jlc3BvbnNlLCBQb3dlclN0YXRlIH0gZnJvbSAnLi4vbW9kZWxzL21vZGVscyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3BsYXRmb3JtJyxcbn0pXG5leHBvcnQgY2xhc3MgS3ZtU2VydmljZSB7XG4gIGNvbm5lY3RLVk1Tb2NrZXQ6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuICBzdG9wd2ViU29ja2V0OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGh0dHA6IEh0dHBDbGllbnQpIHt9XG5cbiAgc2V0QW10RmVhdHVyZXMoZGV2aWNlSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8QW10RmVhdHVyZXNSZXNwb25zZT4ge1xuICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICB1c2VyQ29uc2VudDogJ25vbmUnLFxuICAgICAgZW5hYmxlS1ZNOiB0cnVlLFxuICAgICAgZW5hYmxlU09MOiB0cnVlLFxuICAgICAgZW5hYmxlSURFUjogdHJ1ZSxcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5wb3N0PEFtdEZlYXR1cmVzUmVzcG9uc2U+KFxuICAgICAgICBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXJ9L2FwaS92MS9hbXQvZmVhdHVyZXMvJHtkZXZpY2VJZH1gLFxuICAgICAgICBwYXlsb2FkXG4gICAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuICBnZXRQb3dlclN0YXRlKGRldmljZUlkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFBvd2VyU3RhdGU+IHtcbiAgICByZXR1cm4gdGhpcy5odHRwXG4gICAgICAuZ2V0PFBvd2VyU3RhdGU+KFxuICAgICAgICBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXJ9L2FwaS92MS9hbXQvcG93ZXIvc3RhdGUvJHtkZXZpY2VJZH1gXG4gICAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuICBzZW5kUG93ZXJBY3Rpb24oXG4gICAgZGV2aWNlSWQ6IHN0cmluZyxcbiAgICBhY3Rpb246IG51bWJlcixcbiAgICB1c2VTT0w6IGJvb2xlYW4gPSBmYWxzZVxuICApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICBtZXRob2Q6ICdQb3dlckFjdGlvbicsXG4gICAgICBhY3Rpb24sXG4gICAgICB1c2VTT0wsXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5odHRwXG4gICAgICAucG9zdDxhbnk+KFxuICAgICAgICBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXJ9L2FwaS92MS9hbXQvcG93ZXIvYWN0aW9uLyR7ZGV2aWNlSWR9YCxcbiAgICAgICAgcGF5bG9hZFxuICAgICAgKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4ge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cbn1cbiJdfQ==