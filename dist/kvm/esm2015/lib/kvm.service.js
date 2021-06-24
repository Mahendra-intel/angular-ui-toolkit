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
        const payload = { userConsent: 'none', enableKVM: true, enableSOL: true, enableIDER: true };
        return this.http.post(`${environment.mpsServer}/api/v1/amt/features/${deviceId}`, payload)
            .pipe(catchError((err) => {
            throw err;
        }));
    }
    getPowerState(deviceId) {
        return this.http.get(`${environment.mpsServer}/api/v1/amt/power/state/${deviceId}`)
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
                providedIn: 'platform'
            }]
    }], function () { return [{ type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7QUFPMUQsTUFBTSxPQUFPLFVBQVU7SUFLckIsWUFBNkIsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUg3QyxxQkFBZ0IsR0FBMEIsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFDM0Usa0JBQWEsR0FBMEIsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUE7SUFFdEIsQ0FBQztJQUVsRCxjQUFjLENBQUUsUUFBZ0I7UUFDOUIsTUFBTSxPQUFPLEdBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUE7UUFDM0YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBc0IsR0FBRyxXQUFXLENBQUMsU0FBUyx3QkFBd0IsUUFBUSxFQUFFLEVBQUUsT0FBTyxDQUFDO2FBQzVHLElBQUksQ0FDSCxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNqQixNQUFNLEdBQUcsQ0FBQTtRQUNYLENBQUMsQ0FBQyxDQUNILENBQUE7SUFDTCxDQUFDO0lBQ0QsYUFBYSxDQUFFLFFBQWdCO1FBQzdCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQWEsR0FBRyxXQUFXLENBQUMsU0FBUywyQkFBMkIsUUFBUSxFQUFFLENBQUM7YUFDNUYsSUFBSSxDQUNILFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sR0FBRyxDQUFBO1FBQ1gsQ0FBQyxDQUFDLENBQ0gsQ0FBQTtJQUNMLENBQUM7O29FQXZCVSxVQUFVO2tEQUFWLFVBQVUsV0FBVixVQUFVLG1CQUhULFVBQVU7dUZBR1gsVUFBVTtjQUp0QixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLFVBQVU7YUFDdkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcydcbmltcG9ydCB7IGNhdGNoRXJyb3IgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBBbXRGZWF0dXJlc1Jlc3BvbnNlLCBQb3dlclN0YXRlIH0gZnJvbSAnLi4vbW9kZWxzL21vZGVscyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3BsYXRmb3JtJ1xufSlcblxuZXhwb3J0IGNsYXNzIEt2bVNlcnZpY2Uge1xuXG4gIGNvbm5lY3RLVk1Tb2NrZXQ6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuICBzdG9wd2ViU29ja2V0OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKVxuICBcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cblxuICBzZXRBbXRGZWF0dXJlcyAoZGV2aWNlSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8QW10RmVhdHVyZXNSZXNwb25zZT4ge1xuICAgIGNvbnN0IHBheWxvYWQgPSB7IHVzZXJDb25zZW50OiAnbm9uZScsIGVuYWJsZUtWTTogdHJ1ZSwgZW5hYmxlU09MOiB0cnVlLCBlbmFibGVJREVSOiB0cnVlIH1cbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8QW10RmVhdHVyZXNSZXNwb25zZT4oYCR7ZW52aXJvbm1lbnQubXBzU2VydmVyfS9hcGkvdjEvYW10L2ZlYXR1cmVzLyR7ZGV2aWNlSWR9YCwgcGF5bG9hZClcbiAgICAgIC5waXBlKFxuICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgICB0aHJvdyBlcnJcbiAgICAgICAgfSlcbiAgICAgIClcbiAgfVxuICBnZXRQb3dlclN0YXRlIChkZXZpY2VJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxQb3dlclN0YXRlPiB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8UG93ZXJTdGF0ZT4oYCR7ZW52aXJvbm1lbnQubXBzU2VydmVyfS9hcGkvdjEvYW10L3Bvd2VyL3N0YXRlLyR7ZGV2aWNlSWR9YClcbiAgICAgIC5waXBlKFxuICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgICB0aHJvdyBlcnJcbiAgICAgICAgfSlcbiAgICAgIClcbiAgfVxufVxuIl19