import { NgModule, CUSTOM_ELEMENTS_SCHEMA, } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { KvmComponent } from './kvm.component';
import { DeviceToolbarComponent } from './app/device-toolbar/device-toolbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth.service';
import { KvmService } from './kvm.service';
import { SharedModule } from './shared/shared.module';
import { AuthorizeInterceptor } from './authorize.interceptor';
import * as i0 from "@angular/core";
import * as i1 from "./shared/shared.module";
export class KvmModule {
    static forRoot(param) {
        return {
            ngModule: KvmModule,
            providers: [
                KvmService,
                {
                    provide: 'userInput',
                    useValue: param,
                },
            ],
        };
    }
}
KvmModule.ɵfac = function KvmModule_Factory(t) { return new (t || KvmModule)(); };
KvmModule.ɵmod = i0.ɵɵdefineNgModule({ type: KvmModule });
KvmModule.ɵinj = i0.ɵɵdefineInjector({ providers: [
        AuthService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthorizeInterceptor,
            multi: true,
        },
    ], imports: [[
            HttpClientModule,
            FlexLayoutModule,
            BrowserModule,
            SharedModule.forRoot(),
            BrowserAnimationsModule,
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(KvmModule, { declarations: [KvmComponent, DeviceToolbarComponent], imports: [HttpClientModule,
        FlexLayoutModule,
        BrowserModule, i1.SharedModule, BrowserAnimationsModule], exports: [KvmComponent] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmModule, [{
        type: NgModule,
        args: [{
                declarations: [KvmComponent, DeviceToolbarComponent],
                imports: [
                    HttpClientModule,
                    FlexLayoutModule,
                    BrowserModule,
                    SharedModule.forRoot(),
                    BrowserAnimationsModule,
                ],
                exports: [KvmComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [
                    AuthService,
                    {
                        provide: HTTP_INTERCEPTORS,
                        useClass: AuthorizeInterceptor,
                        multi: true,
                    },
                ],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFFBQVEsRUFDUixzQkFBc0IsR0FHdkIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUN2RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7OztBQXFCL0QsTUFBTSxPQUFPLFNBQVM7SUFDYixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQVU7UUFDOUIsT0FBTztZQUNMLFFBQVEsRUFBRSxTQUFTO1lBQ25CLFNBQVMsRUFBRTtnQkFDVCxVQUFVO2dCQUNWO29CQUNFLE9BQU8sRUFBRSxXQUFXO29CQUNwQixRQUFRLEVBQUUsS0FBSztpQkFDaEI7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOztrRUFaVSxTQUFTOzZDQUFULFNBQVM7a0RBVFQ7UUFDVCxXQUFXO1FBQ1g7WUFDRSxPQUFPLEVBQUUsaUJBQWlCO1lBQzFCLFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsS0FBSyxFQUFFLElBQUk7U0FDWjtLQUNGLFlBaEJRO1lBQ1AsZ0JBQWdCO1lBQ2hCLGdCQUFnQjtZQUNoQixhQUFhO1lBQ2IsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUN0Qix1QkFBdUI7U0FDeEI7d0ZBWVUsU0FBUyxtQkFuQkwsWUFBWSxFQUFFLHNCQUFzQixhQUVqRCxnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLGFBQWEsbUJBRWIsdUJBQXVCLGFBRWYsWUFBWTt1RkFXWCxTQUFTO2NBcEJyQixRQUFRO2VBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsWUFBWSxFQUFFLHNCQUFzQixDQUFDO2dCQUNwRCxPQUFPLEVBQUU7b0JBQ1AsZ0JBQWdCO29CQUNoQixnQkFBZ0I7b0JBQ2hCLGFBQWE7b0JBQ2IsWUFBWSxDQUFDLE9BQU8sRUFBRTtvQkFDdEIsdUJBQXVCO2lCQUN4QjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2dCQUNqQyxTQUFTLEVBQUU7b0JBQ1QsV0FBVztvQkFDWDt3QkFDRSxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixRQUFRLEVBQUUsb0JBQW9CO3dCQUM5QixLQUFLLEVBQUUsSUFBSTtxQkFDWjtpQkFDRjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBOZ01vZHVsZSxcclxuICBDVVNUT01fRUxFTUVOVFNfU0NIRU1BLFxyXG4gIE1vZHVsZVdpdGhQcm92aWRlcnMsXHJcbiAgSW5qZWN0YWJsZSxcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5pbXBvcnQgeyBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XHJcbmltcG9ydCB7IEZsZXhMYXlvdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XHJcbmltcG9ydCB7IEt2bUNvbXBvbmVudCB9IGZyb20gJy4va3ZtLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERldmljZVRvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuL2FwcC9kZXZpY2UtdG9vbGJhci9kZXZpY2UtdG9vbGJhci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlLCBIVFRQX0lOVEVSQ0VQVE9SUyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IEt2bVNlcnZpY2UgfSBmcm9tICcuL2t2bS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XHJcbmltcG9ydCB7IEF1dGhvcml6ZUludGVyY2VwdG9yIH0gZnJvbSAnLi9hdXRob3JpemUuaW50ZXJjZXB0b3InO1xyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW0t2bUNvbXBvbmVudCwgRGV2aWNlVG9vbGJhckNvbXBvbmVudF0sXHJcbiAgaW1wb3J0czogW1xyXG4gICAgSHR0cENsaWVudE1vZHVsZSxcclxuICAgIEZsZXhMYXlvdXRNb2R1bGUsXHJcbiAgICBCcm93c2VyTW9kdWxlLFxyXG4gICAgU2hhcmVkTW9kdWxlLmZvclJvb3QoKSxcclxuICAgIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW0t2bUNvbXBvbmVudF0sXHJcbiAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgQXV0aFNlcnZpY2UsXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxyXG4gICAgICB1c2VDbGFzczogQXV0aG9yaXplSW50ZXJjZXB0b3IsXHJcbiAgICAgIG11bHRpOiB0cnVlLFxyXG4gICAgfSxcclxuICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgS3ZtTW9kdWxlIHtcclxuICBwdWJsaWMgc3RhdGljIGZvclJvb3QocGFyYW06IGFueSk6IE1vZHVsZVdpdGhQcm92aWRlcnM8S3ZtTW9kdWxlPiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogS3ZtTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBLdm1TZXJ2aWNlLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3ZpZGU6ICd1c2VySW5wdXQnLFxyXG4gICAgICAgICAgdXNlVmFsdWU6IHBhcmFtLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=