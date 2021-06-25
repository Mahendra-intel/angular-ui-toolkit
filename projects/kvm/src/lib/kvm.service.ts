import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AmtFeaturesResponse, PowerState } from '../models/models';

@Injectable({
  providedIn: 'platform',
})
export class KvmService {
  connectKVMSocket: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  stopwebSocket: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor(private readonly http: HttpClient) {}

  setAmtFeatures(deviceId: string): Observable<AmtFeaturesResponse> {
    const payload = {
      userConsent: 'none',
      enableKVM: true,
      enableSOL: true,
      enableIDER: true,
    };
    return this.http
      .post<AmtFeaturesResponse>(
        `${environment.mpsServer}/api/v1/amt/features/${deviceId}`,
        payload
      )
      .pipe(
        catchError((err) => {
          throw err;
        })
      );
  }
  getPowerState(deviceId: string): Observable<PowerState> {
    return this.http
      .get<PowerState>(
        `${environment.mpsServer}/api/v1/amt/power/state/${deviceId}`
      )
      .pipe(
        catchError((err) => {
          throw err;
        })
      );
  }
  sendPowerAction(
    deviceId: string,
    action: number,
    useSOL: boolean = false
  ): Observable<any> {
    const payload = {
      method: 'PowerAction',
      action,
      useSOL,
    };
    return this.http
      .post<any>(
        `${environment.mpsServer}/api/v1/amt/power/action/${deviceId}`,
        payload
      )
      .pipe(
        catchError((err) => {
          throw err;
        })
      );
  }
}
