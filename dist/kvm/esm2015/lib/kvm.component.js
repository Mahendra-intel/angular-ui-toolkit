import { Component, EventEmitter, Inject, Input, Output, ViewChild, } from '@angular/core';
import { AMTDesktop, AMTKvmDataRedirector, ConsoleLogger, DataProcessor, KeyBoardHelper, MouseHelper, Protocol, } from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { environment } from '../environments/environment';
import { fromEvent, interval, of, timer } from 'rxjs';
import { catchError, finalize, mergeMap, throttleTime } from 'rxjs/operators';
import { PowerUpAlertComponent } from './shared/power-up-alert/power-up-alert.component';
import SnackbarDefaults from './shared/config/snackBarDefault';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/snack-bar";
import * as i2 from "@angular/material/dialog";
import * as i3 from "./auth.service";
import * as i4 from "./kvm.service";
import * as i5 from "@angular/material/toolbar";
import * as i6 from "@angular/material/form-field";
import * as i7 from "@angular/material/select";
import * as i8 from "@angular/forms";
import * as i9 from "@angular/common";
import * as i10 from "@angular/material/core";
const _c0 = ["canvas"];
function KvmComponent_mat_option_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 4);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const encode_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", encode_r2.value);
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate1(" ", encode_r2.viewValue, " ");
} }
export class KvmComponent {
    constructor(snackBar, dialog, authService, devicesService, params // public readonly activatedRoute: ActivatedRoute
    ) {
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.authService = authService;
        this.devicesService = devicesService;
        this.params = params;
        // //setting a width and height for the canvas
        this.width = 400;
        this.height = 400;
        this.deviceState = 0;
        this.deviceStatus = new EventEmitter();
        this.powerState = 0;
        this.btnText = 'Disconnect';
        this.isPoweredOn = false;
        this.isLoading = false;
        this.deviceId = '';
        this.selected = 1;
        this.server = `${environment.mpsServer.replace('http', 'ws')}/relay`;
        this.previousAction = 'kvm';
        this.selectedAction = '';
        this.mouseMove = null;
        this.encodings = [
            { value: 1, viewValue: 'RLE 8' },
            { value: 2, viewValue: 'RLE 16' },
        ];
        this.onConnectionStateChange = (redirector, state) => {
            this.deviceState = state;
            this.deviceStatus.emit(state);
        };
        this.reset = () => {
            this.redirector = null;
            this.module = null;
            this.dataProcessor = null;
            this.height = 400;
            this.width = 400;
            this.instantiate();
        };
        this.stopKvm = () => {
            this.redirector.stop();
            this.keyboardHelper.UnGrabKeyInput();
            this.reset();
        };
        this.deviceId = this.params.deviceId;
        if (environment.mpsServer.includes('/mps')) {
            //handles kong route
            this.server = `${environment.mpsServer.replace('http', 'ws')}/ws/relay`;
        }
    }
    ngOnInit() {
        this.logger = new ConsoleLogger(1);
        // this.activatedRoute.params.subscribe((params) => {
        //   this.isLoading = true;
        //   this.deviceId = params.id;
        // });
        this.stopSocketSubscription = this.devicesService.stopwebSocket.subscribe(() => {
            this.stopKvm();
        });
        this.startSocketSubscription =
            this.devicesService.connectKVMSocket.subscribe(() => {
                this.setAmtFeatures();
            });
        this.timeInterval = interval(15000)
            .pipe(mergeMap(() => this.devicesService.getPowerState(this.deviceId)))
            .subscribe();
    }
    ngAfterViewInit() {
        this.setAmtFeatures();
    }
    instantiate() {
        var _a, _b;
        this.context = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.nativeElement.getContext('2d');
        this.redirector = new AMTKvmDataRedirector(this.logger, Protocol.KVM, new FileReader(), this.deviceId, 16994, '', '', 0, 0, this.authService.getLoggedUserToken(), this.server);
        this.module = new AMTDesktop(this.logger, this.context);
        this.dataProcessor = new DataProcessor(this.logger, this.redirector, this.module);
        this.mouseHelper = new MouseHelper(this.module, this.redirector, 200);
        this.keyboardHelper = new KeyBoardHelper(this.module, this.redirector);
        this.redirector.onProcessData = this.module.processData.bind(this.module);
        this.redirector.onStart = this.module.start.bind(this.module);
        this.redirector.onNewState = this.module.onStateChange.bind(this.module);
        this.redirector.onSendKvmData = this.module.onSendKvmData.bind(this.module);
        this.redirector.onStateChanged = this.onConnectionStateChange.bind(this);
        this.redirector.onError = this.onRedirectorError.bind(this);
        this.module.onSend = this.redirector.send.bind(this.redirector);
        this.module.onProcessData = this.dataProcessor.processData.bind(this.dataProcessor);
        this.module.bpp = this.selected;
        this.mouseMove = fromEvent((_b = this.canvas) === null || _b === void 0 ? void 0 : _b.nativeElement, 'mousemove');
        this.mouseMove.pipe(throttleTime(200)).subscribe((event) => {
            if (this.mouseHelper != null) {
                this.mouseHelper.mousemove(event);
            }
        });
    }
    onRedirectorError() {
        this.reset();
    }
    init() {
        this.devicesService
            .getPowerState(this.deviceId)
            .pipe(catchError(() => {
            this.snackBar.open(`Error retrieving power status`, undefined, SnackbarDefaults.defaultError);
            return of();
        }), finalize(() => { }))
            .subscribe((data) => {
            this.powerState = data;
            this.isPoweredOn = this.checkPowerStatus();
            if (!this.isPoweredOn) {
                this.isLoading = false;
                const dialog = this.dialog.open(PowerUpAlertComponent);
                dialog.afterClosed().subscribe((result) => {
                    if (result) {
                        this.isLoading = true;
                        this.devicesService
                            .sendPowerAction(this.deviceId, 2)
                            .pipe()
                            .subscribe((data) => {
                            this.instantiate();
                            setTimeout(() => {
                                this.isLoading = false;
                                this.autoConnect();
                            }, 4000);
                        });
                    }
                });
            }
            else {
                this.instantiate();
                setTimeout(() => {
                    this.isLoading = false;
                    this.autoConnect();
                }, 0);
            }
        });
    }
    setAmtFeatures() {
        this.isLoading = true;
        this.devicesService
            .setAmtFeatures(this.deviceId)
            .pipe(catchError(() => {
            this.snackBar.open(`Error enabling kvm`, undefined, SnackbarDefaults.defaultError);
            this.init();
            return of();
        }), finalize(() => { }))
            .subscribe(() => this.init());
    }
    autoConnect() {
        if (this.redirector != null) {
            this.redirector.start(WebSocket);
            this.keyboardHelper.GrabKeyInput();
        }
    }
    onEncodingChange() {
        this.stopKvm();
        timer(1000).subscribe(() => {
            this.autoConnect();
        });
    }
    checkPowerStatus() {
        return this.powerState.powerstate === 2;
    }
    ngDoCheck() {
        if (this.selectedAction !== this.previousAction) {
            this.previousAction = this.selectedAction;
        }
    }
    onMouseup(event) {
        if (this.mouseHelper != null) {
            this.mouseHelper.mouseup(event);
        }
    }
    onMousedown(event) {
        if (this.mouseHelper != null) {
            this.mouseHelper.mousedown(event);
        }
    }
    ngOnDestroy() {
        if (this.timeInterval) {
            this.timeInterval.unsubscribe();
        }
        this.stopKvm();
        if (this.startSocketSubscription) {
            this.startSocketSubscription.unsubscribe();
        }
        if (this.stopSocketSubscription) {
            this.stopSocketSubscription.unsubscribe();
        }
    }
}
KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(i0.ɵɵdirectiveInject(i1.MatSnackBar), i0.ɵɵdirectiveInject(i2.MatDialog), i0.ɵɵdirectiveInject(i3.AuthService), i0.ɵɵdirectiveInject(i4.KvmService), i0.ɵɵdirectiveInject('userInput')); };
KvmComponent.ɵcmp = i0.ɵɵdefineComponent({ type: KvmComponent, selectors: [["amt-kvm"]], viewQuery: function KvmComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 1);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
    } }, inputs: { width: "width", height: "height" }, outputs: { deviceState: "deviceState", deviceStatus: "deviceStatus" }, decls: 8, vars: 4, consts: [[3, "ngModel", "ngModelChange"], [3, "value", 4, "ngFor", "ngForOf"], ["oncontextmenu", "return false", 1, "canvas", 3, "width", "height", "mouseup", "mousedown"], ["canvas", ""], [3, "value"]], template: function KvmComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "mat-toolbar");
        i0.ɵɵelementStart(1, "mat-form-field");
        i0.ɵɵelementStart(2, "mat-label");
        i0.ɵɵtext(3, "Choose encoding type");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(4, "mat-select", 0);
        i0.ɵɵlistener("ngModelChange", function KvmComponent_Template_mat_select_ngModelChange_4_listener($event) { return ctx.selected = $event; })("ngModelChange", function KvmComponent_Template_mat_select_ngModelChange_4_listener() { return ctx.onEncodingChange(); });
        i0.ɵɵtemplate(5, KvmComponent_mat_option_5_Template, 2, 2, "mat-option", 1);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(6, "canvas", 2, 3);
        i0.ɵɵlistener("mouseup", function KvmComponent_Template_canvas_mouseup_6_listener($event) { return ctx.onMouseup($event); })("mousedown", function KvmComponent_Template_canvas_mousedown_6_listener($event) { return ctx.onMousedown($event); });
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(4);
        i0.ɵɵproperty("ngModel", ctx.selected);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngForOf", ctx.encodings);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("width", ctx.width)("height", ctx.height);
    } }, directives: [i5.MatToolbar, i6.MatFormField, i6.MatLabel, i7.MatSelect, i8.NgControlStatus, i8.NgModel, i9.NgForOf, i10.MatOption], encapsulation: 2 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmComponent, [{
        type: Component,
        args: [{
                selector: 'amt-kvm',
                templateUrl: './kvm.component.html',
                styles: [],
            }]
    }], function () { return [{ type: i1.MatSnackBar }, { type: i2.MatDialog }, { type: i3.AuthService }, { type: i4.KvmService }, { type: undefined, decorators: [{
                type: Inject,
                args: ['userInput']
            }] }]; }, { canvas: [{
            type: ViewChild,
            args: ['canvas', { static: false }]
        }], width: [{
            type: Input
        }], height: [{
            type: Input
        }], deviceState: [{
            type: Output
        }], deviceStatus: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLGFBQWEsRUFDYixhQUFhLEVBR2IsY0FBYyxFQUNkLFdBQVcsRUFDWCxRQUFRLEdBQ1QsTUFBTSx5Q0FBeUMsQ0FBQztBQUNqRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFMUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFnQixLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSTlFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3pGLE9BQU8sZ0JBQWdCLE1BQU0saUNBQWlDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lDM0J6RCxxQ0FBb0U7SUFDbEUsWUFDRjtJQUFBLGlCQUFhOzs7SUFGZ0MsdUNBQXNCO0lBQ2pFLGVBQ0Y7SUFERSxvREFDRjs7QURnQ04sTUFBTSxPQUFPLFlBQVk7SUFtQ3ZCLFlBQ1MsUUFBcUIsRUFDckIsTUFBaUIsRUFDUCxXQUF3QixFQUN4QixjQUEwQixFQUNmLE1BQU0sQ0FBQyxpREFBaUQ7O1FBSjdFLGFBQVEsR0FBUixRQUFRLENBQWE7UUFDckIsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUNQLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLG1CQUFjLEdBQWQsY0FBYyxDQUFZO1FBQ2YsV0FBTSxHQUFOLE1BQU0sQ0FBQTtRQXBDcEMsOENBQThDO1FBRTlCLFVBQUssR0FBRyxHQUFHLENBQUM7UUFDWixXQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ25CLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLGlCQUFZLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFTMUUsZUFBVSxHQUFRLENBQUMsQ0FBQztRQUNwQixZQUFPLEdBQVcsWUFBWSxDQUFDO1FBQy9CLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUN0QixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBRXJCLFdBQU0sR0FBVyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3hFLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLG1CQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLGNBQVMsR0FBUSxJQUFJLENBQUM7UUFFdEIsY0FBUyxHQUFHO1lBQ1YsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUU7WUFDaEMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUU7U0FDbEMsQ0FBQztRQW1GRiw0QkFBdUIsR0FBRyxDQUFDLFVBQWUsRUFBRSxLQUFhLEVBQU8sRUFBRTtZQUNoRSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUM7UUF3RkYsVUFBSyxHQUFHLEdBQVMsRUFBRTtZQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNuQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDO1FBRUYsWUFBTyxHQUFHLEdBQVMsRUFBRTtZQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFDO1FBbExBLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDckMsSUFBSSxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMxQyxvQkFBb0I7WUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQ3pFO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLHFEQUFxRDtRQUNyRCwyQkFBMkI7UUFDM0IsK0JBQStCO1FBQy9CLE1BQU07UUFDTixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUN2RSxHQUFHLEVBQUU7WUFDSCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUNGLENBQUM7UUFDRixJQUFJLENBQUMsdUJBQXVCO1lBQzFCLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDbEQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO2FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFDdEUsU0FBUyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELFdBQVc7O1FBQ1QsSUFBSSxDQUFDLE9BQU8sU0FBRyxJQUFJLENBQUMsTUFBTSwwQ0FBRSxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxvQkFBb0IsQ0FDeEMsSUFBSSxDQUFDLE1BQU0sRUFDWCxRQUFRLENBQUMsR0FBRyxFQUNaLElBQUksVUFBVSxFQUFFLEVBQ2hCLElBQUksQ0FBQyxRQUFRLEVBQ2IsS0FBSyxFQUNMLEVBQUUsRUFDRixFQUFFLEVBQ0YsQ0FBQyxFQUNELENBQUMsRUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFLEVBQ3JDLElBQUksQ0FBQyxNQUFNLENBQ1osQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGFBQWEsQ0FDcEMsSUFBSSxDQUFDLE1BQU0sRUFDWCxJQUFJLENBQUMsVUFBVSxFQUNmLElBQUksQ0FBQyxNQUFNLENBQ1osQ0FBQztRQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdkUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQzdELElBQUksQ0FBQyxhQUFhLENBQ25CLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxPQUFDLElBQUksQ0FBQyxNQUFNLDBDQUFFLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRTtZQUM5RCxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO2dCQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNuQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQU9ELGlCQUFpQjtRQUNmLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLGNBQWM7YUFDaEIsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDNUIsSUFBSSxDQUNILFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FDaEIsK0JBQStCLEVBQy9CLFNBQVMsRUFDVCxnQkFBZ0IsQ0FBQyxZQUFZLENBQzlCLENBQUM7WUFDRixPQUFPLEVBQUUsRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLEVBQ0YsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUNuQjthQUNBLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQ3hDLElBQUksTUFBTSxFQUFFO3dCQUNWLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO3dCQUN0QixJQUFJLENBQUMsY0FBYzs2QkFDaEIsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDOzZCQUNqQyxJQUFJLEVBQUU7NkJBQ04sU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7NEJBQ2xCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzs0QkFDbkIsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQ0FDZCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQ0FDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDOzRCQUNyQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ1gsQ0FBQyxDQUFDLENBQUM7cUJBQ047Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ25CLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDckIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ1A7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWM7YUFDaEIsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDN0IsSUFBSSxDQUNILFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FDaEIsb0JBQW9CLEVBQ3BCLFNBQVMsRUFDVCxnQkFBZ0IsQ0FBQyxZQUFZLENBQzlCLENBQUM7WUFDRixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDWixPQUFPLEVBQUUsRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLEVBQ0YsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUNuQjthQUNBLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUN6QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsS0FBSyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQWlCRCxTQUFTO1FBQ1AsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDL0MsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQzNDO0lBQ0gsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFpQjtRQUN6QixJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO1lBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFpQjtRQUMzQixJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO1lBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNqQztRQUNELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO1lBQ2hDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUM1QztRQUNELElBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUMzQztJQUNILENBQUM7O3dFQTNQVSxZQUFZLDRLQXdDYixXQUFXO2lEQXhDVixZQUFZOzs7Ozs7UUN0Q3pCLG1DQUFhO1FBQ1gsc0NBQWdCO1FBQ2QsaUNBQVc7UUFBQSxvQ0FBb0I7UUFBQSxpQkFBWTtRQUMzQyxxQ0FBd0U7UUFBNUQsNElBQXNCLGdHQUFrQixzQkFBa0IsSUFBcEM7UUFDaEMsMkVBRWE7UUFDZixpQkFBYTtRQUNmLGlCQUFpQjtRQUNuQixpQkFBYztRQUNkLG9DQVFDO1FBRkMsbUdBQVcscUJBQWlCLElBQUMsMEZBQ2hCLHVCQUFtQixJQURIO1FBRTlCLGlCQUFTOztRQWZNLGVBQXNCO1FBQXRCLHNDQUFzQjtRQUNELGVBQVk7UUFBWix1Q0FBWTtRQVMvQyxlQUFlO1FBQWYsaUNBQWUsc0JBQUE7O3VGRHlCSixZQUFZO2NBTHhCLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsV0FBVyxFQUFFLHNCQUFzQjtnQkFDbkMsTUFBTSxFQUFFLEVBQUU7YUFDWDs7c0JBeUNJLE1BQU07dUJBQUMsV0FBVzt3QkF2Q21CLE1BQU07a0JBQTdDLFNBQVM7bUJBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUt0QixLQUFLO2tCQUFwQixLQUFLO1lBQ1UsTUFBTTtrQkFBckIsS0FBSztZQUNJLFdBQVc7a0JBQXBCLE1BQU07WUFDRyxZQUFZO2tCQUFyQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENvbXBvbmVudCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbmplY3QsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIE9uSW5pdCxcclxuICBPdXRwdXQsXHJcbiAgVmlld0NoaWxkLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIEFNVERlc2t0b3AsXHJcbiAgQU1US3ZtRGF0YVJlZGlyZWN0b3IsXHJcbiAgQ29uc29sZUxvZ2dlcixcclxuICBEYXRhUHJvY2Vzc29yLFxyXG4gIElEYXRhUHJvY2Vzc29yLFxyXG4gIElMb2dnZXIsXHJcbiAgS2V5Qm9hcmRIZWxwZXIsXHJcbiAgTW91c2VIZWxwZXIsXHJcbiAgUHJvdG9jb2wsXHJcbn0gZnJvbSAnQG9wZW4tYW10LWNsb3VkLXRvb2xraXQvdWktdG9vbGtpdC9jb3JlJztcclxuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBLdm1TZXJ2aWNlIH0gZnJvbSAnLi9rdm0uc2VydmljZSc7XHJcbmltcG9ydCB7IGZyb21FdmVudCwgaW50ZXJ2YWwsIG9mLCBTdWJzY3JpcHRpb24sIHRpbWVyIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGZpbmFsaXplLCBtZXJnZU1hcCwgdGhyb3R0bGVUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2cgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xyXG5pbXBvcnQgeyBNYXRTbmFja0JhciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NuYWNrLWJhcic7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQb3dlclVwQWxlcnRDb21wb25lbnQgfSBmcm9tICcuL3NoYXJlZC9wb3dlci11cC1hbGVydC9wb3dlci11cC1hbGVydC5jb21wb25lbnQnO1xyXG5pbXBvcnQgU25hY2tiYXJEZWZhdWx0cyBmcm9tICcuL3NoYXJlZC9jb25maWcvc25hY2tCYXJEZWZhdWx0JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYW10LWt2bScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2t2bS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVzOiBbXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEt2bUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcclxuICBAVmlld0NoaWxkKCdjYW52YXMnLCB7IHN0YXRpYzogZmFsc2UgfSkgY2FudmFzOiBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xyXG4gIHB1YmxpYyBjb250ZXh0ITogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuICAvLyAvL3NldHRpbmcgYSB3aWR0aCBhbmQgaGVpZ2h0IGZvciB0aGUgY2FudmFzXHJcblxyXG4gIEBJbnB1dCgpIHB1YmxpYyB3aWR0aCA9IDQwMDtcclxuICBASW5wdXQoKSBwdWJsaWMgaGVpZ2h0ID0gNDAwO1xyXG4gIEBPdXRwdXQoKSBkZXZpY2VTdGF0ZTogbnVtYmVyID0gMDtcclxuICBAT3V0cHV0KCkgZGV2aWNlU3RhdHVzOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xyXG4gIHN0b3BTb2NrZXRTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XHJcbiAgc3RhcnRTb2NrZXRTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XHJcbiAgbW9kdWxlOiBhbnk7XHJcbiAgcmVkaXJlY3RvcjogYW55O1xyXG4gIGRhdGFQcm9jZXNzb3IhOiBJRGF0YVByb2Nlc3NvciB8IG51bGw7XHJcbiAgbW91c2VIZWxwZXIhOiBNb3VzZUhlbHBlcjtcclxuICBrZXlib2FyZEhlbHBlciE6IEtleUJvYXJkSGVscGVyO1xyXG4gIGxvZ2dlciE6IElMb2dnZXI7XHJcbiAgcG93ZXJTdGF0ZTogYW55ID0gMDtcclxuICBidG5UZXh0OiBzdHJpbmcgPSAnRGlzY29ubmVjdCc7XHJcbiAgaXNQb3dlcmVkT246IGJvb2xlYW4gPSBmYWxzZTtcclxuICBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBkZXZpY2VJZDogc3RyaW5nID0gJyc7XHJcbiAgc2VsZWN0ZWQ6IG51bWJlciA9IDE7XHJcbiAgdGltZUludGVydmFsITogYW55O1xyXG4gIHNlcnZlcjogc3RyaW5nID0gYCR7ZW52aXJvbm1lbnQubXBzU2VydmVyLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKX0vcmVsYXlgO1xyXG4gIHByZXZpb3VzQWN0aW9uID0gJ2t2bSc7XHJcbiAgc2VsZWN0ZWRBY3Rpb24gPSAnJztcclxuICBtb3VzZU1vdmU6IGFueSA9IG51bGw7XHJcblxyXG4gIGVuY29kaW5ncyA9IFtcclxuICAgIHsgdmFsdWU6IDEsIHZpZXdWYWx1ZTogJ1JMRSA4JyB9LFxyXG4gICAgeyB2YWx1ZTogMiwgdmlld1ZhbHVlOiAnUkxFIDE2JyB9LFxyXG4gIF07XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIHNuYWNrQmFyOiBNYXRTbmFja0JhcixcclxuICAgIHB1YmxpYyBkaWFsb2c6IE1hdERpYWxvZyxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBkZXZpY2VzU2VydmljZTogS3ZtU2VydmljZSxcclxuICAgIEBJbmplY3QoJ3VzZXJJbnB1dCcpIHB1YmxpYyBwYXJhbXMgLy8gcHVibGljIHJlYWRvbmx5IGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVxyXG4gICkge1xyXG4gICAgdGhpcy5kZXZpY2VJZCA9IHRoaXMucGFyYW1zLmRldmljZUlkO1xyXG4gICAgaWYgKGVudmlyb25tZW50Lm1wc1NlcnZlci5pbmNsdWRlcygnL21wcycpKSB7XHJcbiAgICAgIC8vaGFuZGxlcyBrb25nIHJvdXRlXHJcbiAgICAgIHRoaXMuc2VydmVyID0gYCR7ZW52aXJvbm1lbnQubXBzU2VydmVyLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKX0vd3MvcmVsYXlgO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBDb25zb2xlTG9nZ2VyKDEpO1xyXG4gICAgLy8gdGhpcy5hY3RpdmF0ZWRSb3V0ZS5wYXJhbXMuc3Vic2NyaWJlKChwYXJhbXMpID0+IHtcclxuICAgIC8vICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgLy8gICB0aGlzLmRldmljZUlkID0gcGFyYW1zLmlkO1xyXG4gICAgLy8gfSk7XHJcbiAgICB0aGlzLnN0b3BTb2NrZXRTdWJzY3JpcHRpb24gPSB0aGlzLmRldmljZXNTZXJ2aWNlLnN0b3B3ZWJTb2NrZXQuc3Vic2NyaWJlKFxyXG4gICAgICAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zdG9wS3ZtKCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICB0aGlzLnN0YXJ0U29ja2V0U3Vic2NyaXB0aW9uID1cclxuICAgICAgdGhpcy5kZXZpY2VzU2VydmljZS5jb25uZWN0S1ZNU29ja2V0LnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRBbXRGZWF0dXJlcygpO1xyXG4gICAgICB9KTtcclxuICAgIHRoaXMudGltZUludGVydmFsID0gaW50ZXJ2YWwoMTUwMDApXHJcbiAgICAgIC5waXBlKG1lcmdlTWFwKCgpID0+IHRoaXMuZGV2aWNlc1NlcnZpY2UuZ2V0UG93ZXJTdGF0ZSh0aGlzLmRldmljZUlkKSkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2V0QW10RmVhdHVyZXMoKTtcclxuICB9XHJcblxyXG4gIGluc3RhbnRpYXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXM/Lm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMucmVkaXJlY3RvciA9IG5ldyBBTVRLdm1EYXRhUmVkaXJlY3RvcihcclxuICAgICAgdGhpcy5sb2dnZXIsXHJcbiAgICAgIFByb3RvY29sLktWTSxcclxuICAgICAgbmV3IEZpbGVSZWFkZXIoKSxcclxuICAgICAgdGhpcy5kZXZpY2VJZCxcclxuICAgICAgMTY5OTQsXHJcbiAgICAgICcnLFxyXG4gICAgICAnJyxcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgdGhpcy5hdXRoU2VydmljZS5nZXRMb2dnZWRVc2VyVG9rZW4oKSxcclxuICAgICAgdGhpcy5zZXJ2ZXJcclxuICAgICk7XHJcbiAgICB0aGlzLm1vZHVsZSA9IG5ldyBBTVREZXNrdG9wKHRoaXMubG9nZ2VyIGFzIGFueSwgdGhpcy5jb250ZXh0KTtcclxuICAgIHRoaXMuZGF0YVByb2Nlc3NvciA9IG5ldyBEYXRhUHJvY2Vzc29yKFxyXG4gICAgICB0aGlzLmxvZ2dlcixcclxuICAgICAgdGhpcy5yZWRpcmVjdG9yLFxyXG4gICAgICB0aGlzLm1vZHVsZVxyXG4gICAgKTtcclxuICAgIHRoaXMubW91c2VIZWxwZXIgPSBuZXcgTW91c2VIZWxwZXIodGhpcy5tb2R1bGUsIHRoaXMucmVkaXJlY3RvciwgMjAwKTtcclxuICAgIHRoaXMua2V5Ym9hcmRIZWxwZXIgPSBuZXcgS2V5Qm9hcmRIZWxwZXIodGhpcy5tb2R1bGUsIHRoaXMucmVkaXJlY3Rvcik7XHJcblxyXG4gICAgdGhpcy5yZWRpcmVjdG9yLm9uUHJvY2Vzc0RhdGEgPSB0aGlzLm1vZHVsZS5wcm9jZXNzRGF0YS5iaW5kKHRoaXMubW9kdWxlKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vblN0YXJ0ID0gdGhpcy5tb2R1bGUuc3RhcnQuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25OZXdTdGF0ZSA9IHRoaXMubW9kdWxlLm9uU3RhdGVDaGFuZ2UuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25TZW5kS3ZtRGF0YSA9IHRoaXMubW9kdWxlLm9uU2VuZEt2bURhdGEuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25TdGF0ZUNoYW5nZWQgPSB0aGlzLm9uQ29ubmVjdGlvblN0YXRlQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25FcnJvciA9IHRoaXMub25SZWRpcmVjdG9yRXJyb3IuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubW9kdWxlLm9uU2VuZCA9IHRoaXMucmVkaXJlY3Rvci5zZW5kLmJpbmQodGhpcy5yZWRpcmVjdG9yKTtcclxuICAgIHRoaXMubW9kdWxlLm9uUHJvY2Vzc0RhdGEgPSB0aGlzLmRhdGFQcm9jZXNzb3IucHJvY2Vzc0RhdGEuYmluZChcclxuICAgICAgdGhpcy5kYXRhUHJvY2Vzc29yXHJcbiAgICApO1xyXG4gICAgdGhpcy5tb2R1bGUuYnBwID0gdGhpcy5zZWxlY3RlZDtcclxuICAgIHRoaXMubW91c2VNb3ZlID0gZnJvbUV2ZW50KHRoaXMuY2FudmFzPy5uYXRpdmVFbGVtZW50LCAnbW91c2Vtb3ZlJyk7XHJcbiAgICB0aGlzLm1vdXNlTW92ZS5waXBlKHRocm90dGxlVGltZSgyMDApKS5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgaWYgKHRoaXMubW91c2VIZWxwZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMubW91c2VIZWxwZXIubW91c2Vtb3ZlKGV2ZW50KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZSA9IChyZWRpcmVjdG9yOiBhbnksIHN0YXRlOiBudW1iZXIpOiBhbnkgPT4ge1xyXG4gICAgdGhpcy5kZXZpY2VTdGF0ZSA9IHN0YXRlO1xyXG4gICAgdGhpcy5kZXZpY2VTdGF0dXMuZW1pdChzdGF0ZSk7XHJcbiAgfTtcclxuXHJcbiAgb25SZWRpcmVjdG9yRXJyb3IoKTogdm9pZCB7XHJcbiAgICB0aGlzLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBpbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5kZXZpY2VzU2VydmljZVxyXG4gICAgICAuZ2V0UG93ZXJTdGF0ZSh0aGlzLmRldmljZUlkKVxyXG4gICAgICAucGlwZShcclxuICAgICAgICBjYXRjaEVycm9yKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuc25hY2tCYXIub3BlbihcclxuICAgICAgICAgICAgYEVycm9yIHJldHJpZXZpbmcgcG93ZXIgc3RhdHVzYCxcclxuICAgICAgICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBTbmFja2JhckRlZmF1bHRzLmRlZmF1bHRFcnJvclxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHJldHVybiBvZigpO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGZpbmFsaXplKCgpID0+IHt9KVxyXG4gICAgICApXHJcbiAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLnBvd2VyU3RhdGUgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuaXNQb3dlcmVkT24gPSB0aGlzLmNoZWNrUG93ZXJTdGF0dXMoKTtcclxuICAgICAgICBpZiAoIXRoaXMuaXNQb3dlcmVkT24pIHtcclxuICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICBjb25zdCBkaWFsb2cgPSB0aGlzLmRpYWxvZy5vcGVuKFBvd2VyVXBBbGVydENvbXBvbmVudCk7XHJcbiAgICAgICAgICBkaWFsb2cuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIHRoaXMuZGV2aWNlc1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5zZW5kUG93ZXJBY3Rpb24odGhpcy5kZXZpY2VJZCwgMilcclxuICAgICAgICAgICAgICAgIC5waXBlKClcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5pbnN0YW50aWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0b0Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgICAgICAgfSwgNDAwMCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuaW5zdGFudGlhdGUoKTtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmF1dG9Db25uZWN0KCk7XHJcbiAgICAgICAgICB9LCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0QW10RmVhdHVyZXMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICB0aGlzLmRldmljZXNTZXJ2aWNlXHJcbiAgICAgIC5zZXRBbXRGZWF0dXJlcyh0aGlzLmRldmljZUlkKVxyXG4gICAgICAucGlwZShcclxuICAgICAgICBjYXRjaEVycm9yKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuc25hY2tCYXIub3BlbihcclxuICAgICAgICAgICAgYEVycm9yIGVuYWJsaW5nIGt2bWAsXHJcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgU25hY2tiYXJEZWZhdWx0cy5kZWZhdWx0RXJyb3JcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICAgIHJldHVybiBvZigpO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGZpbmFsaXplKCgpID0+IHt9KVxyXG4gICAgICApXHJcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5pbml0KCkpO1xyXG4gIH1cclxuXHJcbiAgYXV0b0Nvbm5lY3QoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5yZWRpcmVjdG9yICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5yZWRpcmVjdG9yLnN0YXJ0KFdlYlNvY2tldCk7XHJcbiAgICAgIHRoaXMua2V5Ym9hcmRIZWxwZXIuR3JhYktleUlucHV0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkVuY29kaW5nQ2hhbmdlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zdG9wS3ZtKCk7XHJcbiAgICB0aW1lcigxMDAwKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmF1dG9Db25uZWN0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoZWNrUG93ZXJTdGF0dXMoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5wb3dlclN0YXRlLnBvd2Vyc3RhdGUgPT09IDI7XHJcbiAgfVxyXG5cclxuICByZXNldCA9ICgpOiB2b2lkID0+IHtcclxuICAgIHRoaXMucmVkaXJlY3RvciA9IG51bGw7XHJcbiAgICB0aGlzLm1vZHVsZSA9IG51bGw7XHJcbiAgICB0aGlzLmRhdGFQcm9jZXNzb3IgPSBudWxsO1xyXG4gICAgdGhpcy5oZWlnaHQgPSA0MDA7XHJcbiAgICB0aGlzLndpZHRoID0gNDAwO1xyXG4gICAgdGhpcy5pbnN0YW50aWF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIHN0b3BLdm0gPSAoKTogdm9pZCA9PiB7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iuc3RvcCgpO1xyXG4gICAgdGhpcy5rZXlib2FyZEhlbHBlci5VbkdyYWJLZXlJbnB1dCgpO1xyXG4gICAgdGhpcy5yZXNldCgpO1xyXG4gIH07XHJcblxyXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkQWN0aW9uICE9PSB0aGlzLnByZXZpb3VzQWN0aW9uKSB7XHJcbiAgICAgIHRoaXMucHJldmlvdXNBY3Rpb24gPSB0aGlzLnNlbGVjdGVkQWN0aW9uO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25Nb3VzZXVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5tb3VzZUhlbHBlciAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMubW91c2VIZWxwZXIubW91c2V1cChldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbk1vdXNlZG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubW91c2VIZWxwZXIgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLm1vdXNlSGVscGVyLm1vdXNlZG93bihldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnRpbWVJbnRlcnZhbCkge1xyXG4gICAgICB0aGlzLnRpbWVJbnRlcnZhbC51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdG9wS3ZtKCk7XHJcbiAgICBpZiAodGhpcy5zdGFydFNvY2tldFN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLnN0YXJ0U29ja2V0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5zdG9wU29ja2V0U3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuc3RvcFNvY2tldFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCI8bWF0LXRvb2xiYXI+XHJcbiAgPG1hdC1mb3JtLWZpZWxkPlxyXG4gICAgPG1hdC1sYWJlbD5DaG9vc2UgZW5jb2RpbmcgdHlwZTwvbWF0LWxhYmVsPlxyXG4gICAgPG1hdC1zZWxlY3QgWyhuZ01vZGVsKV09XCJzZWxlY3RlZFwiIChuZ01vZGVsQ2hhbmdlKT1cIm9uRW5jb2RpbmdDaGFuZ2UoKVwiPlxyXG4gICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgZW5jb2RlIG9mIGVuY29kaW5nc1wiIFt2YWx1ZV09XCJlbmNvZGUudmFsdWVcIj5cclxuICAgICAgICB7eyBlbmNvZGUudmlld1ZhbHVlIH19XHJcbiAgICAgIDwvbWF0LW9wdGlvbj5cclxuICAgIDwvbWF0LXNlbGVjdD5cclxuICA8L21hdC1mb3JtLWZpZWxkPlxyXG48L21hdC10b29sYmFyPlxyXG48Y2FudmFzXHJcbiAgY2xhc3M9XCJjYW52YXNcIlxyXG4gICNjYW52YXNcclxuICBbd2lkdGhdPVwid2lkdGhcIlxyXG4gIFtoZWlnaHRdPVwiaGVpZ2h0XCJcclxuICBvbmNvbnRleHRtZW51PVwicmV0dXJuIGZhbHNlXCJcclxuICAobW91c2V1cCk9XCJvbk1vdXNldXAoJGV2ZW50KVwiXHJcbiAgKG1vdXNlZG93bik9XCJvbk1vdXNlZG93bigkZXZlbnQpXCJcclxuPjwvY2FudmFzPlxyXG4iXX0=