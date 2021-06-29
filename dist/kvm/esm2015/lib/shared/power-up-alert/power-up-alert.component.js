import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "@angular/material/button";
export class PowerUpAlertComponent {
    constructor() { }
    ngOnInit() {
    }
}
PowerUpAlertComponent.ɵfac = function PowerUpAlertComponent_Factory(t) { return new (t || PowerUpAlertComponent)(); };
PowerUpAlertComponent.ɵcmp = i0.ɵɵdefineComponent({ type: PowerUpAlertComponent, selectors: [["amt-power-up-alert"]], decls: 9, vars: 1, consts: [["mat-dialog-title", ""], [1, "mat-typography"], ["align", "end"], ["mat-button", "", "mat-dialog-close", ""], ["mat-button", "", "cdkFocusInitial", "", 3, "mat-dialog-close"]], template: function PowerUpAlertComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "h2", 0);
        i0.ɵɵtext(1, "Your device is not powered on");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(2, "mat-dialog-content", 1);
        i0.ɵɵtext(3, " Do you want to send a power up command to the device?\n");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(4, "mat-dialog-actions", 2);
        i0.ɵɵelementStart(5, "button", 3);
        i0.ɵɵtext(6, "No");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(7, "button", 4);
        i0.ɵɵtext(8, "Yes");
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(7);
        i0.ɵɵproperty("mat-dialog-close", true);
    } }, directives: [i1.MatDialogTitle, i1.MatDialogContent, i1.MatDialogActions, i2.MatButton, i1.MatDialogClose], styles: [""] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PowerUpAlertComponent, [{
        type: Component,
        args: [{
                selector: 'amt-power-up-alert',
                templateUrl: './power-up-alert.component.html',
                styleUrls: ['./power-up-alert.component.scss']
            }]
    }], function () { return []; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG93ZXItdXAtYWxlcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMva3ZtL3NyYy9saWIvc2hhcmVkL3Bvd2VyLXVwLWFsZXJ0L3Bvd2VyLXVwLWFsZXJ0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL3NoYXJlZC9wb3dlci11cC1hbGVydC9wb3dlci11cC1hbGVydC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sZUFBZSxDQUFDOzs7O0FBT2xELE1BQU0sT0FBTyxxQkFBcUI7SUFFaEMsZ0JBQWdCLENBQUM7SUFFakIsUUFBUTtJQUNSLENBQUM7OzBGQUxVLHFCQUFxQjswREFBckIscUJBQXFCO1FDUGxDLDZCQUFxQjtRQUFBLDZDQUE2QjtRQUFBLGlCQUFLO1FBQ3ZELDZDQUEyQztRQUN6Qyx3RUFDRjtRQUFBLGlCQUFxQjtRQUNyQiw2Q0FBZ0M7UUFDOUIsaUNBQW9DO1FBQUEsa0JBQUU7UUFBQSxpQkFBUztRQUMvQyxpQ0FBNkQ7UUFBQSxtQkFBRztRQUFBLGlCQUFTO1FBQzNFLGlCQUFxQjs7UUFEQSxlQUF5QjtRQUF6Qix1Q0FBeUI7O3VGRENqQyxxQkFBcUI7Y0FMakMsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLFdBQVcsRUFBRSxpQ0FBaUM7Z0JBQzlDLFNBQVMsRUFBRSxDQUFDLGlDQUFpQyxDQUFDO2FBQy9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYW10LXBvd2VyLXVwLWFsZXJ0JyxcclxuICB0ZW1wbGF0ZVVybDogJy4vcG93ZXItdXAtYWxlcnQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3Bvd2VyLXVwLWFsZXJ0LmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIFBvd2VyVXBBbGVydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gIH1cclxuXHJcbn1cclxuIiwiPGgyIG1hdC1kaWFsb2ctdGl0bGU+WW91ciBkZXZpY2UgaXMgbm90IHBvd2VyZWQgb248L2gyPlxyXG48bWF0LWRpYWxvZy1jb250ZW50IGNsYXNzPVwibWF0LXR5cG9ncmFwaHlcIj5cclxuICBEbyB5b3Ugd2FudCB0byBzZW5kIGEgcG93ZXIgdXAgY29tbWFuZCB0byB0aGUgZGV2aWNlP1xyXG48L21hdC1kaWFsb2ctY29udGVudD5cclxuPG1hdC1kaWFsb2ctYWN0aW9ucyBhbGlnbj1cImVuZFwiPlxyXG4gIDxidXR0b24gbWF0LWJ1dHRvbiBtYXQtZGlhbG9nLWNsb3NlPk5vPC9idXR0b24+XHJcbiAgPGJ1dHRvbiBtYXQtYnV0dG9uIFttYXQtZGlhbG9nLWNsb3NlXT1cInRydWVcIiBjZGtGb2N1c0luaXRpYWw+WWVzPC9idXR0b24+XHJcbjwvbWF0LWRpYWxvZy1hY3Rpb25zPlxyXG4iXX0=