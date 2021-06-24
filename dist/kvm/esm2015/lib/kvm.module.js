import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KvmComponent } from './kvm.component';
import { DeviceToolbarComponent } from './app/device-toolbar/device-toolbar.component';
import { HttpClientModule } from '@angular/common/http';
import * as i0 from "@angular/core";
export class KvmModule {
}
KvmModule.ɵfac = function KvmModule_Factory(t) { return new (t || KvmModule)(); };
KvmModule.ɵmod = i0.ɵɵdefineNgModule({ type: KvmModule });
KvmModule.ɵinj = i0.ɵɵdefineInjector({ providers: [], imports: [[HttpClientModule, BrowserModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(KvmModule, { declarations: [KvmComponent, DeviceToolbarComponent], imports: [HttpClientModule, BrowserModule], exports: [KvmComponent] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmModule, [{
        type: NgModule,
        args: [{
                declarations: [KvmComponent, DeviceToolbarComponent],
                imports: [HttpClientModule, BrowserModule],
                exports: [KvmComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDOztBQVN4RCxNQUFNLE9BQU8sU0FBUzs7a0VBQVQsU0FBUzs2Q0FBVCxTQUFTO2tEQUZULEVBQUUsWUFISixDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQzt3RkFLL0IsU0FBUyxtQkFOTCxZQUFZLEVBQUUsc0JBQXNCLGFBQ3pDLGdCQUFnQixFQUFFLGFBQWEsYUFDL0IsWUFBWTt1RkFJWCxTQUFTO2NBUHJCLFFBQVE7ZUFBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxZQUFZLEVBQUUsc0JBQXNCLENBQUM7Z0JBQ3BELE9BQU8sRUFBRSxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQztnQkFDMUMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztnQkFDakMsU0FBUyxFQUFFLEVBQUU7YUFDZCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBLdm1Db21wb25lbnQgfSBmcm9tICcuL2t2bS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGV2aWNlVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vYXBwL2RldmljZS10b29sYmFyL2RldmljZS10b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtLdm1Db21wb25lbnQsIERldmljZVRvb2xiYXJDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbSHR0cENsaWVudE1vZHVsZSwgQnJvd3Nlck1vZHVsZV0sXG4gIGV4cG9ydHM6IFtLdm1Db21wb25lbnRdLFxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV0sXG4gIHByb3ZpZGVyczogW10sXG59KVxuZXhwb3J0IGNsYXNzIEt2bU1vZHVsZSB7fVxuIl19