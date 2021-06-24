import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { KvmComponent } from './kvm.component';
import { DeviceToolbarComponent } from './app/device-toolbar/device-toolbar.component';
import * as i0 from "@angular/core";
export class KvmModule {
}
KvmModule.ɵfac = function KvmModule_Factory(t) { return new (t || KvmModule)(); };
KvmModule.ɵmod = i0.ɵɵdefineNgModule({ type: KvmModule });
KvmModule.ɵinj = i0.ɵɵdefineInjector({ imports: [[]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(KvmModule, { declarations: [KvmComponent, DeviceToolbarComponent], exports: [KvmComponent] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmModule, [{
        type: NgModule,
        args: [{
                declarations: [KvmComponent, DeviceToolbarComponent],
                imports: [],
                exports: [KvmComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sK0NBQStDLENBQUM7O0FBUXZGLE1BQU0sT0FBTyxTQUFTOztrRUFBVCxTQUFTOzZDQUFULFNBQVM7aURBSlgsRUFBRTt3RkFJQSxTQUFTLG1CQUxMLFlBQVksRUFBRSxzQkFBc0IsYUFFekMsWUFBWTt1RkFHWCxTQUFTO2NBTnJCLFFBQVE7ZUFBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxZQUFZLEVBQUUsc0JBQXNCLENBQUM7Z0JBQ3BELE9BQU8sRUFBRSxFQUFFO2dCQUNYLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDdkIsT0FBTyxFQUFDLENBQUMsc0JBQXNCLENBQUM7YUFDakMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgS3ZtQ29tcG9uZW50IH0gZnJvbSAnLi9rdm0uY29tcG9uZW50JztcbmltcG9ydCB7IERldmljZVRvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuL2FwcC9kZXZpY2UtdG9vbGJhci9kZXZpY2UtdG9vbGJhci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtLdm1Db21wb25lbnQsIERldmljZVRvb2xiYXJDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbXSxcbiAgZXhwb3J0czogW0t2bUNvbXBvbmVudF0sXG4gIHNjaGVtYXM6W0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdXG59KVxuZXhwb3J0IGNsYXNzIEt2bU1vZHVsZSB7fVxuIl19