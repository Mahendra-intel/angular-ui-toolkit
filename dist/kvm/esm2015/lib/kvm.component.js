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
import * as i3 from "./kvm.service";
const _c0 = ["canvas"];
export class KvmComponent {
    constructor(snackBar, dialog, devicesService, params) {
        this.snackBar = snackBar;
        this.dialog = dialog;
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
        this.redirector = new AMTKvmDataRedirector(this.logger, Protocol.KVM, new FileReader(), this.deviceId, 16994, '', '', 0, 0, this.params.authToken, this.server);
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
KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(i0.ɵɵdirectiveInject(i1.MatSnackBar), i0.ɵɵdirectiveInject(i2.MatDialog), i0.ɵɵdirectiveInject(i3.KvmService), i0.ɵɵdirectiveInject('userInput')); };
KvmComponent.ɵcmp = i0.ɵɵdefineComponent({ type: KvmComponent, selectors: [["amt-kvm"]], viewQuery: function KvmComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 1);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
    } }, inputs: { width: "width", height: "height" }, outputs: { deviceState: "deviceState", deviceStatus: "deviceStatus" }, decls: 3, vars: 2, consts: [["oncontextmenu", "return false", 1, "canvas", 3, "width", "height", "mouseup", "mousedown"], ["canvas", ""]], template: function KvmComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div");
        i0.ɵɵelementStart(1, "canvas", 0, 1);
        i0.ɵɵlistener("mouseup", function KvmComponent_Template_canvas_mouseup_1_listener($event) { return ctx.onMouseup($event); })("mousedown", function KvmComponent_Template_canvas_mousedown_1_listener($event) { return ctx.onMousedown($event); });
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("width", ctx.width)("height", ctx.height);
    } }, encapsulation: 2 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmComponent, [{
        type: Component,
        args: [{
                selector: 'amt-kvm',
                templateUrl: './kvm.component.html',
                styleUrls: []
            }]
    }], function () { return [{ type: i1.MatSnackBar }, { type: i2.MatDialog }, { type: i3.KvmService }, { type: undefined, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLGFBQWEsRUFDYixhQUFhLEVBR2IsY0FBYyxFQUNkLFdBQVcsRUFDWCxRQUFRLEdBQ1QsTUFBTSx5Q0FBeUMsQ0FBQztBQUNqRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFMUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFnQixLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRzlFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3pGLE9BQU8sZ0JBQWdCLE1BQU0saUNBQWlDLENBQUM7Ozs7OztBQU8vRCxNQUFNLE9BQU8sWUFBWTtJQW1DdkIsWUFDUyxRQUFxQixFQUNyQixNQUFpQixFQUNQLGNBQTBCLEVBQ2YsTUFBTTtRQUgzQixhQUFRLEdBQVIsUUFBUSxDQUFhO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQVc7UUFDUCxtQkFBYyxHQUFkLGNBQWMsQ0FBWTtRQUNmLFdBQU0sR0FBTixNQUFNLENBQUE7UUFuQ3BDLDhDQUE4QztRQUU5QixVQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ1osV0FBTSxHQUFHLEdBQUcs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RUFBRSxDQUFDO1NBQzVDO1FBQ0QsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzNDO0lBQ0gsQ0FBQzs7d0VBdFBVLFlBQVksc0lBdUNiLFdBQVc7aURBdkNWLFlBQVk7Ozs7OztRQ3JDekIsMkJBQUs7UUFDSCxvQ0FRQztRQUZDLG1HQUFXLHFCQUFpQixJQUFDLDBGQUNoQix1QkFBbUIsSUFESDtRQUU5QixpQkFBUztRQUNaLGlCQUFNOztRQU5GLGVBQWU7UUFBZixpQ0FBZSxzQkFBQTs7dUZEaUNOLFlBQVk7Y0FMeEIsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxTQUFTO2dCQUNuQixXQUFXLEVBQUUsc0JBQXNCO2dCQUNuQyxTQUFTLEVBQUUsRUFBRTthQUNkOztzQkF3Q0ksTUFBTTt1QkFBQyxXQUFXO3dCQXRDbUIsTUFBTTtrQkFBN0MsU0FBUzttQkFBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1lBS3RCLEtBQUs7a0JBQXBCLEtBQUs7WUFDVSxNQUFNO2tCQUFyQixLQUFLO1lBQ0ksV0FBVztrQkFBcEIsTUFBTTtZQUNHLFlBQVk7a0JBQXJCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgQ29tcG9uZW50LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIEluamVjdCxcclxuICBJbnB1dCxcclxuICBPbkRlc3Ryb3ksXHJcbiAgT25Jbml0LFxyXG4gIE91dHB1dCxcclxuICBWaWV3Q2hpbGQsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgQU1URGVza3RvcCxcclxuICBBTVRLdm1EYXRhUmVkaXJlY3RvcixcclxuICBDb25zb2xlTG9nZ2VyLFxyXG4gIERhdGFQcm9jZXNzb3IsXHJcbiAgSURhdGFQcm9jZXNzb3IsXHJcbiAgSUxvZ2dlcixcclxuICBLZXlCb2FyZEhlbHBlcixcclxuICBNb3VzZUhlbHBlcixcclxuICBQcm90b2NvbCxcclxufSBmcm9tICdAb3Blbi1hbXQtY2xvdWQtdG9vbGtpdC91aS10b29sa2l0L2NvcmUnO1xyXG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IEt2bVNlcnZpY2UgfSBmcm9tICcuL2t2bS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgZnJvbUV2ZW50LCBpbnRlcnZhbCwgb2YsIFN1YnNjcmlwdGlvbiwgdGltZXIgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZmluYWxpemUsIG1lcmdlTWFwLCB0aHJvdHRsZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IE1hdERpYWxvZyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XHJcbmltcG9ydCB7IE1hdFNuYWNrQmFyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc25hY2stYmFyJztcclxuaW1wb3J0IHsgUG93ZXJVcEFsZXJ0Q29tcG9uZW50IH0gZnJvbSAnLi9zaGFyZWQvcG93ZXItdXAtYWxlcnQvcG93ZXItdXAtYWxlcnQuY29tcG9uZW50JztcclxuaW1wb3J0IFNuYWNrYmFyRGVmYXVsdHMgZnJvbSAnLi9zaGFyZWQvY29uZmlnL3NuYWNrQmFyRGVmYXVsdCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FtdC1rdm0nLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9rdm0uY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogW11cclxufSlcclxuZXhwb3J0IGNsYXNzIEt2bUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcclxuICBAVmlld0NoaWxkKCdjYW52YXMnLCB7IHN0YXRpYzogZmFsc2UgfSkgY2FudmFzOiBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xyXG4gIHB1YmxpYyBjb250ZXh0ITogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuICAvLyAvL3NldHRpbmcgYSB3aWR0aCBhbmQgaGVpZ2h0IGZvciB0aGUgY2FudmFzXHJcblxyXG4gIEBJbnB1dCgpIHB1YmxpYyB3aWR0aCA9IDQwMDtcclxuICBASW5wdXQoKSBwdWJsaWMgaGVpZ2h0ID0gNDAwO1xyXG4gIEBPdXRwdXQoKSBkZXZpY2VTdGF0ZTogbnVtYmVyID0gMDtcclxuICBAT3V0cHV0KCkgZGV2aWNlU3RhdHVzOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xyXG4gIHN0b3BTb2NrZXRTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XHJcbiAgc3RhcnRTb2NrZXRTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XHJcbiAgbW9kdWxlOiBhbnk7XHJcbiAgcmVkaXJlY3RvcjogYW55O1xyXG4gIGRhdGFQcm9jZXNzb3IhOiBJRGF0YVByb2Nlc3NvciB8IG51bGw7XHJcbiAgbW91c2VIZWxwZXIhOiBNb3VzZUhlbHBlcjtcclxuICBrZXlib2FyZEhlbHBlciE6IEtleUJvYXJkSGVscGVyO1xyXG4gIGxvZ2dlciE6IElMb2dnZXI7XHJcbiAgcG93ZXJTdGF0ZTogYW55ID0gMDtcclxuICBidG5UZXh0OiBzdHJpbmcgPSAnRGlzY29ubmVjdCc7XHJcbiAgaXNQb3dlcmVkT246IGJvb2xlYW4gPSBmYWxzZTtcclxuICBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBkZXZpY2VJZDogc3RyaW5nID0gJyc7XHJcbiAgc2VsZWN0ZWQ6IG51bWJlciA9IDE7XHJcbiAgdGltZUludGVydmFsITogYW55O1xyXG4gIHNlcnZlcjogc3RyaW5nID0gYCR7ZW52aXJvbm1lbnQubXBzU2VydmVyLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKX0vcmVsYXlgO1xyXG4gIHByZXZpb3VzQWN0aW9uID0gJ2t2bSc7XHJcbiAgc2VsZWN0ZWRBY3Rpb24gPSAnJztcclxuICBtb3VzZU1vdmU6IGFueSA9IG51bGw7XHJcblxyXG4gIGVuY29kaW5ncyA9IFtcclxuICAgIHsgdmFsdWU6IDEsIHZpZXdWYWx1ZTogJ1JMRSA4JyB9LFxyXG4gICAgeyB2YWx1ZTogMiwgdmlld1ZhbHVlOiAnUkxFIDE2JyB9LFxyXG4gIF07XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIHNuYWNrQmFyOiBNYXRTbmFja0JhcixcclxuICAgIHB1YmxpYyBkaWFsb2c6IE1hdERpYWxvZyxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGV2aWNlc1NlcnZpY2U6IEt2bVNlcnZpY2UsXHJcbiAgICBASW5qZWN0KCd1c2VySW5wdXQnKSBwdWJsaWMgcGFyYW1zXHJcbiAgKSB7XHJcbiAgICB0aGlzLmRldmljZUlkID0gdGhpcy5wYXJhbXMuZGV2aWNlSWQ7XHJcbiAgICBpZiAoZW52aXJvbm1lbnQubXBzU2VydmVyLmluY2x1ZGVzKCcvbXBzJykpIHtcclxuICAgICAgLy9oYW5kbGVzIGtvbmcgcm91dGVcclxuICAgICAgdGhpcy5zZXJ2ZXIgPSBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXIucmVwbGFjZSgnaHR0cCcsICd3cycpfS93cy9yZWxheWA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMubG9nZ2VyID0gbmV3IENvbnNvbGVMb2dnZXIoMSk7XHJcbiAgICB0aGlzLnN0b3BTb2NrZXRTdWJzY3JpcHRpb24gPSB0aGlzLmRldmljZXNTZXJ2aWNlLnN0b3B3ZWJTb2NrZXQuc3Vic2NyaWJlKFxyXG4gICAgICAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zdG9wS3ZtKCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICB0aGlzLnN0YXJ0U29ja2V0U3Vic2NyaXB0aW9uID1cclxuICAgICAgdGhpcy5kZXZpY2VzU2VydmljZS5jb25uZWN0S1ZNU29ja2V0LnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRBbXRGZWF0dXJlcygpO1xyXG4gICAgICB9KTtcclxuICAgIHRoaXMudGltZUludGVydmFsID0gaW50ZXJ2YWwoMTUwMDApXHJcbiAgICAgIC5waXBlKG1lcmdlTWFwKCgpID0+IHRoaXMuZGV2aWNlc1NlcnZpY2UuZ2V0UG93ZXJTdGF0ZSh0aGlzLmRldmljZUlkKSkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2V0QW10RmVhdHVyZXMoKTtcclxuICB9XHJcblxyXG4gIGluc3RhbnRpYXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXM/Lm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMucmVkaXJlY3RvciA9IG5ldyBBTVRLdm1EYXRhUmVkaXJlY3RvcihcclxuICAgICAgdGhpcy5sb2dnZXIsXHJcbiAgICAgIFByb3RvY29sLktWTSxcclxuICAgICAgbmV3IEZpbGVSZWFkZXIoKSxcclxuICAgICAgdGhpcy5kZXZpY2VJZCxcclxuICAgICAgMTY5OTQsXHJcbiAgICAgICcnLFxyXG4gICAgICAnJyxcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgdGhpcy5wYXJhbXMuYXV0aFRva2VuLFxyXG4gICAgICB0aGlzLnNlcnZlclxyXG4gICAgKTtcclxuICAgIHRoaXMubW9kdWxlID0gbmV3IEFNVERlc2t0b3AodGhpcy5sb2dnZXIgYXMgYW55LCB0aGlzLmNvbnRleHQpO1xyXG4gICAgdGhpcy5kYXRhUHJvY2Vzc29yID0gbmV3IERhdGFQcm9jZXNzb3IoXHJcbiAgICAgIHRoaXMubG9nZ2VyLFxyXG4gICAgICB0aGlzLnJlZGlyZWN0b3IsXHJcbiAgICAgIHRoaXMubW9kdWxlXHJcbiAgICApO1xyXG4gICAgdGhpcy5tb3VzZUhlbHBlciA9IG5ldyBNb3VzZUhlbHBlcih0aGlzLm1vZHVsZSwgdGhpcy5yZWRpcmVjdG9yLCAyMDApO1xyXG4gICAgdGhpcy5rZXlib2FyZEhlbHBlciA9IG5ldyBLZXlCb2FyZEhlbHBlcih0aGlzLm1vZHVsZSwgdGhpcy5yZWRpcmVjdG9yKTtcclxuXHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25Qcm9jZXNzRGF0YSA9IHRoaXMubW9kdWxlLnByb2Nlc3NEYXRhLmJpbmQodGhpcy5tb2R1bGUpO1xyXG4gICAgdGhpcy5yZWRpcmVjdG9yLm9uU3RhcnQgPSB0aGlzLm1vZHVsZS5zdGFydC5iaW5kKHRoaXMubW9kdWxlKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vbk5ld1N0YXRlID0gdGhpcy5tb2R1bGUub25TdGF0ZUNoYW5nZS5iaW5kKHRoaXMubW9kdWxlKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vblNlbmRLdm1EYXRhID0gdGhpcy5tb2R1bGUub25TZW5kS3ZtRGF0YS5iaW5kKHRoaXMubW9kdWxlKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vblN0YXRlQ2hhbmdlZCA9IHRoaXMub25Db25uZWN0aW9uU3RhdGVDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vbkVycm9yID0gdGhpcy5vblJlZGlyZWN0b3JFcnJvci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5tb2R1bGUub25TZW5kID0gdGhpcy5yZWRpcmVjdG9yLnNlbmQuYmluZCh0aGlzLnJlZGlyZWN0b3IpO1xyXG4gICAgdGhpcy5tb2R1bGUub25Qcm9jZXNzRGF0YSA9IHRoaXMuZGF0YVByb2Nlc3Nvci5wcm9jZXNzRGF0YS5iaW5kKFxyXG4gICAgICB0aGlzLmRhdGFQcm9jZXNzb3JcclxuICAgICk7XHJcbiAgICB0aGlzLm1vZHVsZS5icHAgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgdGhpcy5tb3VzZU1vdmUgPSBmcm9tRXZlbnQodGhpcy5jYW52YXM/Lm5hdGl2ZUVsZW1lbnQsICdtb3VzZW1vdmUnKTtcclxuICAgIHRoaXMubW91c2VNb3ZlLnBpcGUodGhyb3R0bGVUaW1lKDIwMCkpLnN1YnNjcmliZSgoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5tb3VzZUhlbHBlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5tb3VzZUhlbHBlci5tb3VzZW1vdmUoZXZlbnQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uQ29ubmVjdGlvblN0YXRlQ2hhbmdlID0gKHJlZGlyZWN0b3I6IGFueSwgc3RhdGU6IG51bWJlcik6IGFueSA9PiB7XHJcbiAgICB0aGlzLmRldmljZVN0YXRlID0gc3RhdGU7XHJcbiAgICB0aGlzLmRldmljZVN0YXR1cy5lbWl0KHN0YXRlKTtcclxuICB9O1xyXG5cclxuICBvblJlZGlyZWN0b3JFcnJvcigpOiB2b2lkIHtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIGluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmRldmljZXNTZXJ2aWNlXHJcbiAgICAgIC5nZXRQb3dlclN0YXRlKHRoaXMuZGV2aWNlSWQpXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5zbmFja0Jhci5vcGVuKFxyXG4gICAgICAgICAgICBgRXJyb3IgcmV0cmlldmluZyBwb3dlciBzdGF0dXNgLFxyXG4gICAgICAgICAgICB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIFNuYWNrYmFyRGVmYXVsdHMuZGVmYXVsdEVycm9yXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgcmV0dXJuIG9mKCk7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgZmluYWxpemUoKCkgPT4ge30pXHJcbiAgICAgIClcclxuICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMucG93ZXJTdGF0ZSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5pc1Bvd2VyZWRPbiA9IHRoaXMuY2hlY2tQb3dlclN0YXR1cygpO1xyXG4gICAgICAgIGlmICghdGhpcy5pc1Bvd2VyZWRPbikge1xyXG4gICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIGNvbnN0IGRpYWxvZyA9IHRoaXMuZGlhbG9nLm9wZW4oUG93ZXJVcEFsZXJ0Q29tcG9uZW50KTtcclxuICAgICAgICAgIGRpYWxvZy5hZnRlckNsb3NlZCgpLnN1YnNjcmliZSgocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgdGhpcy5kZXZpY2VzU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLnNlbmRQb3dlckFjdGlvbih0aGlzLmRldmljZUlkLCAyKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmluc3RhbnRpYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRvQ29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICB9LCA0MDAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5pbnN0YW50aWF0ZSgpO1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0b0Nvbm5lY3QoKTtcclxuICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRBbXRGZWF0dXJlcygpOiB2b2lkIHtcclxuICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgIHRoaXMuZGV2aWNlc1NlcnZpY2VcclxuICAgICAgLnNldEFtdEZlYXR1cmVzKHRoaXMuZGV2aWNlSWQpXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5zbmFja0Jhci5vcGVuKFxyXG4gICAgICAgICAgICBgRXJyb3IgZW5hYmxpbmcga3ZtYCxcclxuICAgICAgICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBTbmFja2JhckRlZmF1bHRzLmRlZmF1bHRFcnJvclxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgICAgcmV0dXJuIG9mKCk7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgZmluYWxpemUoKCkgPT4ge30pXHJcbiAgICAgIClcclxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLmluaXQoKSk7XHJcbiAgfVxyXG5cclxuICBhdXRvQ29ubmVjdCgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnJlZGlyZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnJlZGlyZWN0b3Iuc3RhcnQoV2ViU29ja2V0KTtcclxuICAgICAgdGhpcy5rZXlib2FyZEhlbHBlci5HcmFiS2V5SW5wdXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uRW5jb2RpbmdDaGFuZ2UoKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0b3BLdm0oKTtcclxuICAgIHRpbWVyKDEwMDApLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMuYXV0b0Nvbm5lY3QoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tQb3dlclN0YXR1cygpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnBvd2VyU3RhdGUucG93ZXJzdGF0ZSA9PT0gMjtcclxuICB9XHJcblxyXG4gIHJlc2V0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgdGhpcy5yZWRpcmVjdG9yID0gbnVsbDtcclxuICAgIHRoaXMubW9kdWxlID0gbnVsbDtcclxuICAgIHRoaXMuZGF0YVByb2Nlc3NvciA9IG51bGw7XHJcbiAgICB0aGlzLmhlaWdodCA9IDQwMDtcclxuICAgIHRoaXMud2lkdGggPSA0MDA7XHJcbiAgICB0aGlzLmluc3RhbnRpYXRlKCk7XHJcbiAgfTtcclxuXHJcbiAgc3RvcEt2bSA9ICgpOiB2b2lkID0+IHtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5zdG9wKCk7XHJcbiAgICB0aGlzLmtleWJvYXJkSGVscGVyLlVuR3JhYktleUlucHV0KCk7XHJcbiAgICB0aGlzLnJlc2V0KCk7XHJcbiAgfTtcclxuXHJcbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRBY3Rpb24gIT09IHRoaXMucHJldmlvdXNBY3Rpb24pIHtcclxuICAgICAgdGhpcy5wcmV2aW91c0FjdGlvbiA9IHRoaXMuc2VsZWN0ZWRBY3Rpb247XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbk1vdXNldXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLm1vdXNlSGVscGVyICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5tb3VzZUhlbHBlci5tb3VzZXVwKGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uTW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5tb3VzZUhlbHBlciAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMubW91c2VIZWxwZXIubW91c2Vkb3duKGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMudGltZUludGVydmFsKSB7XHJcbiAgICAgIHRoaXMudGltZUludGVydmFsLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN0b3BLdm0oKTtcclxuICAgIGlmICh0aGlzLnN0YXJ0U29ja2V0U3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuc3RhcnRTb2NrZXRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnN0b3BTb2NrZXRTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5zdG9wU29ja2V0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIjxkaXY+XHJcbiAgPGNhbnZhc1xyXG4gICAgY2xhc3M9XCJjYW52YXNcIlxyXG4gICAgI2NhbnZhc1xyXG4gICAgW3dpZHRoXT1cIndpZHRoXCJcclxuICAgIFtoZWlnaHRdPVwiaGVpZ2h0XCJcclxuICAgIG9uY29udGV4dG1lbnU9XCJyZXR1cm4gZmFsc2VcIlxyXG4gICAgKG1vdXNldXApPVwib25Nb3VzZXVwKCRldmVudClcIlxyXG4gICAgKG1vdXNlZG93bik9XCJvbk1vdXNlZG93bigkZXZlbnQpXCJcclxuICA+PC9jYW52YXM+XHJcbjwvZGl2PlxyXG4iXX0=