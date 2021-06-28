import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KvmComponent } from './kvm.component';
import { DeviceToolbarComponent } from './app/device-toolbar/device-toolbar.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { KvmService } from './kvm.service';
import { SharedModule } from './shared/shared.module';
import * as i0 from "@angular/core";
import * as i1 from "./shared/shared.module";
export class KvmModule {
}
KvmModule.ɵfac = function KvmModule_Factory(t) { return new (t || KvmModule)(); };
KvmModule.ɵmod = i0.ɵɵdefineNgModule({ type: KvmModule });
KvmModule.ɵinj = i0.ɵɵdefineInjector({ providers: [AuthService, KvmService], imports: [[HttpClientModule, BrowserModule, SharedModule.forRoot()]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(KvmModule, { declarations: [KvmComponent, DeviceToolbarComponent], imports: [HttpClientModule, BrowserModule, i1.SharedModule], exports: [KvmComponent] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmModule, [{
        type: NgModule,
        args: [{
                declarations: [KvmComponent, DeviceToolbarComponent],
                imports: [HttpClientModule, BrowserModule, SharedModule.forRoot()],
                exports: [KvmComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [AuthService, KvmService],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7O0FBU3RELE1BQU0sT0FBTyxTQUFTOztrRUFBVCxTQUFTOzZDQUFULFNBQVM7a0RBRlQsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLFlBSDNCLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxFQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3RkFLdEQsU0FBUyxtQkFOTCxZQUFZLEVBQUUsc0JBQXNCLGFBQ3pDLGdCQUFnQixFQUFFLGFBQWEsOEJBQy9CLFlBQVk7dUZBSVgsU0FBUztjQVByQixRQUFRO2VBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsWUFBWSxFQUFFLHNCQUFzQixDQUFDO2dCQUNwRCxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLEVBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNqRSxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2dCQUNqQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDO2FBQ3JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5pbXBvcnQgeyBLdm1Db21wb25lbnQgfSBmcm9tICcuL2t2bS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBEZXZpY2VUb29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAvZGV2aWNlLXRvb2xiYXIvZGV2aWNlLXRvb2xiYXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IEt2bVNlcnZpY2UgfSBmcm9tICcuL2t2bS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW0t2bUNvbXBvbmVudCwgRGV2aWNlVG9vbGJhckNvbXBvbmVudF0sXHJcbiAgaW1wb3J0czogW0h0dHBDbGllbnRNb2R1bGUsIEJyb3dzZXJNb2R1bGUsU2hhcmVkTW9kdWxlLmZvclJvb3QoKV0sXHJcbiAgZXhwb3J0czogW0t2bUNvbXBvbmVudF0sXHJcbiAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdLFxyXG4gIHByb3ZpZGVyczogW0F1dGhTZXJ2aWNlLCBLdm1TZXJ2aWNlXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEt2bU1vZHVsZSB7fVxyXG4iXX0=