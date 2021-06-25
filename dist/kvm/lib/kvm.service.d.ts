import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AmtFeaturesResponse, PowerState } from '../models/models';
import * as i0 from "@angular/core";
export declare class KvmService {
    private readonly http;
    connectKVMSocket: EventEmitter<boolean>;
    stopwebSocket: EventEmitter<boolean>;
    constructor(http: HttpClient);
    setAmtFeatures(deviceId: string): Observable<AmtFeaturesResponse>;
    getPowerState(deviceId: string): Observable<PowerState>;
    sendPowerAction(deviceId: string, action: number, useSOL?: boolean): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<KvmService, never>;
    static ɵprov: i0.ɵɵInjectableDef<KvmService>;
}
//# sourceMappingURL=kvm.service.d.ts.map