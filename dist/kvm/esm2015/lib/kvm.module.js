import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KvmComponent } from './kvm.component';
import { DeviceToolbarComponent } from './app/device-toolbar/device-toolbar.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { KvmService } from './kvm.service';
import * as i0 from "@angular/core";
export class KvmModule {
}
KvmModule.ɵfac = function KvmModule_Factory(t) { return new (t || KvmModule)(); };
KvmModule.ɵmod = i0.ɵɵdefineNgModule({ type: KvmModule });
KvmModule.ɵinj = i0.ɵɵdefineInjector({ providers: [AuthService, KvmService], imports: [[HttpClientModule, BrowserModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(KvmModule, { declarations: [KvmComponent, DeviceToolbarComponent], imports: [HttpClientModule, BrowserModule], exports: [KvmComponent] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmModule, [{
        type: NgModule,
        args: [{
                declarations: [KvmComponent, DeviceToolbarComponent],
                imports: [HttpClientModule, BrowserModule],
                exports: [KvmComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [AuthService, KvmService],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQVMzQyxNQUFNLE9BQU8sU0FBUzs7a0VBQVQsU0FBUzs2Q0FBVCxTQUFTO2tEQUZULENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxZQUgzQixDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQzt3RkFLL0IsU0FBUyxtQkFOTCxZQUFZLEVBQUUsc0JBQXNCLGFBQ3pDLGdCQUFnQixFQUFFLGFBQWEsYUFDL0IsWUFBWTt1RkFJWCxTQUFTO2NBUHJCLFFBQVE7ZUFBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxZQUFZLEVBQUUsc0JBQXNCLENBQUM7Z0JBQ3BELE9BQU8sRUFBRSxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQztnQkFDMUMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztnQkFDakMsU0FBUyxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQzthQUNyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBLdm1Db21wb25lbnQgfSBmcm9tICcuL2t2bS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGV2aWNlVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vYXBwL2RldmljZS10b29sYmFyL2RldmljZS10b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBLdm1TZXJ2aWNlIH0gZnJvbSAnLi9rdm0uc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW0t2bUNvbXBvbmVudCwgRGV2aWNlVG9vbGJhckNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtIdHRwQ2xpZW50TW9kdWxlLCBCcm93c2VyTW9kdWxlXSxcbiAgZXhwb3J0czogW0t2bUNvbXBvbmVudF0sXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXSxcbiAgcHJvdmlkZXJzOiBbQXV0aFNlcnZpY2UsIEt2bVNlcnZpY2VdLFxufSlcbmV4cG9ydCBjbGFzcyBLdm1Nb2R1bGUge31cbiJdfQ==