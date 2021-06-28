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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7QUFNMUQsTUFBTSxPQUFPLFVBQVU7SUFJckIsWUFBNkIsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUg3QyxxQkFBZ0IsR0FBMEIsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFDM0Usa0JBQWEsR0FBMEIsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7SUFFeEIsQ0FBQztJQUVqRCxjQUFjLENBQUMsUUFBZ0I7UUFDN0IsTUFBTSxPQUFPLEdBQUc7WUFDZCxXQUFXLEVBQUUsTUFBTTtZQUNuQixTQUFTLEVBQUUsSUFBSTtZQUNmLFNBQVMsRUFBRSxJQUFJO1lBQ2YsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLElBQUk7YUFDYixJQUFJLENBQ0gsR0FBRyxXQUFXLENBQUMsU0FBUyx3QkFBd0IsUUFBUSxFQUFFLEVBQzFELE9BQU8sQ0FDUjthQUNBLElBQUksQ0FDSCxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNqQixNQUFNLEdBQUcsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDTixDQUFDO0lBQ0QsYUFBYSxDQUFDLFFBQWdCO1FBQzVCLE9BQU8sSUFBSSxDQUFDLElBQUk7YUFDYixHQUFHLENBQ0YsR0FBRyxXQUFXLENBQUMsU0FBUywyQkFBMkIsUUFBUSxFQUFFLENBQzlEO2FBQ0EsSUFBSSxDQUNILFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sR0FBRyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNOLENBQUM7SUFDRCxlQUFlLENBQ2IsUUFBZ0IsRUFDaEIsTUFBYyxFQUNkLFNBQWtCLEtBQUs7UUFFdkIsTUFBTSxPQUFPLEdBQUc7WUFDZCxNQUFNLEVBQUUsYUFBYTtZQUNyQixNQUFNO1lBQ04sTUFBTTtTQUNQLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxJQUFJO2FBQ2IsSUFBSSxDQUNILEdBQUcsV0FBVyxDQUFDLFNBQVMsNEJBQTRCLFFBQVEsRUFBRSxFQUM5RCxPQUFPLENBQ1I7YUFDQSxJQUFJLENBQ0gsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDakIsTUFBTSxHQUFHLENBQUM7UUFDWixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ04sQ0FBQzs7b0VBdkRVLFVBQVU7a0RBQVYsVUFBVSxXQUFWLFVBQVUsbUJBRlQsVUFBVTt1RkFFWCxVQUFVO2NBSHRCLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsVUFBVTthQUN2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgQW10RmVhdHVyZXNSZXNwb25zZSwgUG93ZXJTdGF0ZSB9IGZyb20gJy4uL21vZGVscy9tb2RlbHMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdwbGF0Zm9ybScsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBLdm1TZXJ2aWNlIHtcclxuICBjb25uZWN0S1ZNU29ja2V0OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcclxuICBzdG9wd2ViU29ja2V0OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBodHRwOiBIdHRwQ2xpZW50KSB7fVxyXG5cclxuICBzZXRBbXRGZWF0dXJlcyhkZXZpY2VJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxBbXRGZWF0dXJlc1Jlc3BvbnNlPiB7XHJcbiAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICB1c2VyQ29uc2VudDogJ25vbmUnLFxyXG4gICAgICBlbmFibGVLVk06IHRydWUsXHJcbiAgICAgIGVuYWJsZVNPTDogdHJ1ZSxcclxuICAgICAgZW5hYmxlSURFUjogdHJ1ZSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gdGhpcy5odHRwXHJcbiAgICAgIC5wb3N0PEFtdEZlYXR1cmVzUmVzcG9uc2U+KFxyXG4gICAgICAgIGAke2Vudmlyb25tZW50Lm1wc1NlcnZlcn0vYXBpL3YxL2FtdC9mZWF0dXJlcy8ke2RldmljZUlkfWAsXHJcbiAgICAgICAgcGF5bG9hZFxyXG4gICAgICApXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4ge1xyXG4gICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgfVxyXG4gIGdldFBvd2VyU3RhdGUoZGV2aWNlSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8UG93ZXJTdGF0ZT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cFxyXG4gICAgICAuZ2V0PFBvd2VyU3RhdGU+KFxyXG4gICAgICAgIGAke2Vudmlyb25tZW50Lm1wc1NlcnZlcn0vYXBpL3YxL2FtdC9wb3dlci9zdGF0ZS8ke2RldmljZUlkfWBcclxuICAgICAgKVxyXG4gICAgICAucGlwZShcclxuICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcclxuICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gIH1cclxuICBzZW5kUG93ZXJBY3Rpb24oXHJcbiAgICBkZXZpY2VJZDogc3RyaW5nLFxyXG4gICAgYWN0aW9uOiBudW1iZXIsXHJcbiAgICB1c2VTT0w6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICBtZXRob2Q6ICdQb3dlckFjdGlvbicsXHJcbiAgICAgIGFjdGlvbixcclxuICAgICAgdXNlU09MLFxyXG4gICAgfTtcclxuICAgIHJldHVybiB0aGlzLmh0dHBcclxuICAgICAgLnBvc3Q8YW55PihcclxuICAgICAgICBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXJ9L2FwaS92MS9hbXQvcG93ZXIvYWN0aW9uLyR7ZGV2aWNlSWR9YCxcclxuICAgICAgICBwYXlsb2FkXHJcbiAgICAgIClcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XHJcbiAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICB9XHJcbn1cclxuIl19