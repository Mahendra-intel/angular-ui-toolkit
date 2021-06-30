import { NgModule, CUSTOM_ELEMENTS_SCHEMA, } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { KvmComponent } from './kvm.component';
import { DeviceToolbarComponent } from './app/device-toolbar/device-toolbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
                    {
                        provide: HTTP_INTERCEPTORS,
                        useClass: AuthorizeInterceptor,
                        multi: true,
                    },
                ],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFFBQVEsRUFDUixzQkFBc0IsR0FFdkIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUN2RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7O0FBb0IvRCxNQUFNLE9BQU8sU0FBUztJQUNiLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBVTtRQUM5QixPQUFPO1lBQ0wsUUFBUSxFQUFFLFNBQVM7WUFDbkIsU0FBUyxFQUFFO2dCQUNULFVBQVU7Z0JBQ1Y7b0JBQ0UsT0FBTyxFQUFFLFdBQVc7b0JBQ3BCLFFBQVEsRUFBRSxLQUFLO2lCQUNoQjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7O2tFQVpVLFNBQVM7NkNBQVQsU0FBUztrREFSVDtRQUNUO1lBQ0UsT0FBTyxFQUFFLGlCQUFpQjtZQUMxQixRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLEtBQUssRUFBRSxJQUFJO1NBQ1o7S0FDRixZQWZRO1lBQ1AsZ0JBQWdCO1lBQ2hCLGdCQUFnQjtZQUNoQixhQUFhO1lBQ2IsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUN0Qix1QkFBdUI7U0FDeEI7d0ZBV1UsU0FBUyxtQkFsQkwsWUFBWSxFQUFFLHNCQUFzQixhQUVqRCxnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLGFBQWEsbUJBRWIsdUJBQXVCLGFBRWYsWUFBWTt1RkFVWCxTQUFTO2NBbkJyQixRQUFRO2VBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsWUFBWSxFQUFFLHNCQUFzQixDQUFDO2dCQUNwRCxPQUFPLEVBQUU7b0JBQ1AsZ0JBQWdCO29CQUNoQixnQkFBZ0I7b0JBQ2hCLGFBQWE7b0JBQ2IsWUFBWSxDQUFDLE9BQU8sRUFBRTtvQkFDdEIsdUJBQXVCO2lCQUN4QjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2dCQUNqQyxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsUUFBUSxFQUFFLG9CQUFvQjt3QkFDOUIsS0FBSyxFQUFFLElBQUk7cUJBQ1o7aUJBQ0Y7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgTmdNb2R1bGUsXHJcbiAgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSxcclxuICBNb2R1bGVXaXRoUHJvdmlkZXJzLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcclxuaW1wb3J0IHsgRmxleExheW91dE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0JztcclxuaW1wb3J0IHsgS3ZtQ29tcG9uZW50IH0gZnJvbSAnLi9rdm0uY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGV2aWNlVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vYXBwL2RldmljZS10b29sYmFyL2RldmljZS10b29sYmFyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGUsIEhUVFBfSU5URVJDRVBUT1JTIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBLdm1TZXJ2aWNlIH0gZnJvbSAnLi9rdm0uc2VydmljZSc7XHJcbmltcG9ydCB7IFNoYXJlZE1vZHVsZSB9IGZyb20gJy4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBBdXRob3JpemVJbnRlcmNlcHRvciB9IGZyb20gJy4vYXV0aG9yaXplLmludGVyY2VwdG9yJztcclxuQE5nTW9kdWxlKHtcclxuICBkZWNsYXJhdGlvbnM6IFtLdm1Db21wb25lbnQsIERldmljZVRvb2xiYXJDb21wb25lbnRdLFxyXG4gIGltcG9ydHM6IFtcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBGbGV4TGF5b3V0TW9kdWxlLFxyXG4gICAgQnJvd3Nlck1vZHVsZSxcclxuICAgIFNoYXJlZE1vZHVsZS5mb3JSb290KCksXHJcbiAgICBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtLdm1Db21wb25lbnRdLFxyXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXHJcbiAgICAgIHVzZUNsYXNzOiBBdXRob3JpemVJbnRlcmNlcHRvcixcclxuICAgICAgbXVsdGk6IHRydWUsXHJcbiAgICB9LFxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBLdm1Nb2R1bGUge1xyXG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdChwYXJhbTogYW55KTogTW9kdWxlV2l0aFByb3ZpZGVyczxLdm1Nb2R1bGU+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBLdm1Nb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIEt2bVNlcnZpY2UsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcHJvdmlkZTogJ3VzZXJJbnB1dCcsXHJcbiAgICAgICAgICB1c2VWYWx1ZTogcGFyYW0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==