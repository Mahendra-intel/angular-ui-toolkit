import { Component, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { AMTDesktop, AMTKvmDataRedirector, ConsoleLogger, DataProcessor, KeyBoardHelper, MouseHelper, Protocol, } from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { environment } from '../environments/environment';
import { fromEvent, interval, of, timer } from 'rxjs';
import { catchError, finalize, mergeMap, throttleTime } from 'rxjs/operators';
import { PowerUpAlertComponent } from './shared/power-up-alert/power-up-alert.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "./auth.service";
import * as i3 from "./kvm.service";
const _c0 = ["canvas"];
// import { ActivatedRoute } from '@angular/router';
export class KvmComponent {
    constructor(
    // public snackBar: MatSnackBar,
    dialog, authService, devicesService) {
        this.dialog = dialog;
        this.authService = authService;
        this.devicesService = devicesService;
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
            // this.snackBar.open(`Error retrieving power status`, undefined, SnackbarDefaults.defaultError)
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
        console.log('coming inside in setAmtfeatures');
        this.devicesService
            .setAmtFeatures(this.deviceId)
            .pipe(catchError(() => {
            // this.snackBar.open(`Error enabling kvm`, undefined, SnackbarDefaults.defaultError)
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
KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(i0.ɵɵdirectiveInject(i1.MatDialog), i0.ɵɵdirectiveInject(i2.AuthService), i0.ɵɵdirectiveInject(i3.KvmService)); };
KvmComponent.ɵcmp = i0.ɵɵdefineComponent({ type: KvmComponent, selectors: [["amt-kvm"]], viewQuery: function KvmComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 1);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
    } }, inputs: { width: "width", height: "height" }, outputs: { deviceState: "deviceState", deviceStatus: "deviceStatus" }, decls: 5, vars: 2, consts: [[2, "display", "block"], ["oncontextmenu", "return false", 1, "canvas", 3, "width", "height", "mouseup", "mousedown"], ["canvas", ""]], template: function KvmComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div");
        i0.ɵɵelementStart(1, "button", 0);
        i0.ɵɵtext(2, " connect ");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(3, "canvas", 1, 2);
        i0.ɵɵlistener("mouseup", function KvmComponent_Template_canvas_mouseup_3_listener($event) { return ctx.onMouseup($event); })("mousedown", function KvmComponent_Template_canvas_mousedown_3_listener($event) { return ctx.onMousedown($event); });
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(3);
        i0.ɵɵproperty("width", ctx.width)("height", ctx.height);
    } }, encapsulation: 2 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmComponent, [{
        type: Component,
        args: [{
                selector: 'amt-kvm',
                templateUrl: './kvm.component.html',
                styles: [],
            }]
    }], function () { return [{ type: i1.MatDialog }, { type: i2.AuthService }, { type: i3.KvmService }]; }, { canvas: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsYUFBYSxFQUNiLGFBQWEsRUFHYixjQUFjLEVBQ2QsV0FBVyxFQUNYLFFBQVEsR0FDVCxNQUFNLHlDQUF5QyxDQUFDO0FBQ2pELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUcxRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQWdCLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFNOUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sa0RBQWtELENBQUM7Ozs7OztBQUN6RixvREFBb0Q7QUFPcEQsTUFBTSxPQUFPLFlBQVk7SUFtQ3ZCO0lBQ0UsZ0NBQWdDO0lBQ3pCLE1BQWlCLEVBQ1AsV0FBd0IsRUFDeEIsY0FBMEI7UUFGcEMsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUNQLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLG1CQUFjLEdBQWQsY0FBYyxDQUFZO1FBbkM3Qyw4Q0FBOEM7UUFFOUIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUNaLFdBQU0sR0FBRyxHQUFHLENBQUM7UUFDbkIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsaUJBQVksR0FBeUIsSUFB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Z0M7UUFBQyx5QkFBUTtRQUFBLGlCQUFTO1FBQ2xELG9DQUE4SjtRQUFoRSxtR0FBVyxxQkFBaUIsSUFBQywwRkFBYyx1QkFBbUIsSUFBakM7UUFBbUMsaUJBQVM7UUFDM0ssaUJBQU07O1FBRDZCLGVBQWU7UUFBZixpQ0FBZSxzQkFBQTs7dUZEcUNyQyxZQUFZO2NBTHhCLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsV0FBVyxFQUFFLHNCQUFzQjtnQkFDbkMsTUFBTSxFQUFFLEVBQUU7YUFDWDsrR0FFeUMsTUFBTTtrQkFBN0MsU0FBUzttQkFBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1lBS3RCLEtBQUs7a0JBQXBCLEtBQUs7WUFDVSxNQUFNO2tCQUFyQixLQUFLO1lBQ0ksV0FBVztrQkFBcEIsTUFBTTtZQUNHLFlBQVk7a0JBQXJCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgQ29tcG9uZW50LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIElucHV0LFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFZpZXdDaGlsZCxcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICBBTVREZXNrdG9wLFxyXG4gIEFNVEt2bURhdGFSZWRpcmVjdG9yLFxyXG4gIENvbnNvbGVMb2dnZXIsXHJcbiAgRGF0YVByb2Nlc3NvcixcclxuICBJRGF0YVByb2Nlc3NvcixcclxuICBJTG9nZ2VyLFxyXG4gIEtleUJvYXJkSGVscGVyLFxyXG4gIE1vdXNlSGVscGVyLFxyXG4gIFByb3RvY29sLFxyXG59IGZyb20gJ0BvcGVuLWFtdC1jbG91ZC10b29sa2l0L3VpLXRvb2xraXQvY29yZSc7XHJcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcclxuLy8gaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBLdm1TZXJ2aWNlIH0gZnJvbSAnLi9rdm0uc2VydmljZSc7XHJcbmltcG9ydCB7IGZyb21FdmVudCwgaW50ZXJ2YWwsIG9mLCBTdWJzY3JpcHRpb24sIHRpbWVyIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGZpbmFsaXplLCBtZXJnZU1hcCwgdGhyb3R0bGVUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2cgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xyXG4vLyBpbXBvcnQgeyBNYXRTbmFja0JhciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NuYWNrLWJhcic7XHJcbi8vIGltcG9ydCB7IFBvd2VyVXBBbGVydENvbXBvbmVudCB9IGZyb20gJy4vc2hhcmVkL3Bvd2VyLXVwLWFsZXJ0L3Bvd2VyLXVwLWFsZXJ0LmNvbXBvbmVudCc7XHJcbi8vIGltcG9ydCBTbmFja2JhckRlZmF1bHRzIGZyb20gJy4vc2hhcmVkL2NvbmZpZy9zbmFja0JhckRlZmF1bHQnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJ1xyXG5pbXBvcnQgeyBQb3dlclVwQWxlcnRDb21wb25lbnQgfSBmcm9tICcuL3NoYXJlZC9wb3dlci11cC1hbGVydC9wb3dlci11cC1hbGVydC5jb21wb25lbnQnO1xyXG4vLyBpbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FtdC1rdm0nLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9rdm0uY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlczogW10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBLdm1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XHJcbiAgQFZpZXdDaGlsZCgnY2FudmFzJywgeyBzdGF0aWM6IGZhbHNlIH0pIGNhbnZhczogRWxlbWVudFJlZiB8IHVuZGVmaW5lZDtcclxuICBwdWJsaWMgY29udGV4dCE6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHJcbiAgLy8gLy9zZXR0aW5nIGEgd2lkdGggYW5kIGhlaWdodCBmb3IgdGhlIGNhbnZhc1xyXG5cclxuICBASW5wdXQoKSBwdWJsaWMgd2lkdGggPSA0MDA7XHJcbiAgQElucHV0KCkgcHVibGljIGhlaWdodCA9IDQwMDtcclxuICBAT3V0cHV0KCkgZGV2aWNlU3RhdGU6IG51bWJlciA9IDA7XHJcbiAgQE91dHB1dCgpIGRldmljZVN0YXR1czogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcclxuICBzdG9wU29ja2V0U3Vic2NyaXB0aW9uITogU3Vic2NyaXB0aW9uO1xyXG4gIHN0YXJ0U29ja2V0U3Vic2NyaXB0aW9uITogU3Vic2NyaXB0aW9uO1xyXG4gIG1vZHVsZTogYW55O1xyXG4gIHJlZGlyZWN0b3I6IGFueTtcclxuICBkYXRhUHJvY2Vzc29yITogSURhdGFQcm9jZXNzb3IgfCBudWxsO1xyXG4gIG1vdXNlSGVscGVyITogTW91c2VIZWxwZXI7XHJcbiAga2V5Ym9hcmRIZWxwZXIhOiBLZXlCb2FyZEhlbHBlcjtcclxuICBsb2dnZXIhOiBJTG9nZ2VyO1xyXG4gIHBvd2VyU3RhdGU6IGFueSA9IDA7XHJcbiAgYnRuVGV4dDogc3RyaW5nID0gJ0Rpc2Nvbm5lY3QnO1xyXG4gIGlzUG93ZXJlZE9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgZGV2aWNlSWQ6IHN0cmluZyA9ICcnO1xyXG4gIHNlbGVjdGVkOiBudW1iZXIgPSAxO1xyXG4gIHRpbWVJbnRlcnZhbCE6IGFueTtcclxuICBzZXJ2ZXI6IHN0cmluZyA9IGAke2Vudmlyb25tZW50Lm1wc1NlcnZlci5yZXBsYWNlKCdodHRwJywgJ3dzJyl9L3JlbGF5YDtcclxuICBwcmV2aW91c0FjdGlvbiA9ICdrdm0nO1xyXG4gIHNlbGVjdGVkQWN0aW9uID0gJyc7XHJcbiAgbW91c2VNb3ZlOiBhbnkgPSBudWxsO1xyXG5cclxuICBlbmNvZGluZ3MgPSBbXHJcbiAgICB7IHZhbHVlOiAxLCB2aWV3VmFsdWU6ICdSTEUgOCcgfSxcclxuICAgIHsgdmFsdWU6IDIsIHZpZXdWYWx1ZTogJ1JMRSAxNicgfSxcclxuICBdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIC8vIHB1YmxpYyBzbmFja0JhcjogTWF0U25hY2tCYXIsXHJcbiAgICBwdWJsaWMgZGlhbG9nOiBNYXREaWFsb2csXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGV2aWNlc1NlcnZpY2U6IEt2bVNlcnZpY2UsXHJcbiAgICAvLyBwdWJsaWMgcmVhZG9ubHkgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlXHJcbiAgKSB7XHJcbiAgICBpZiAoZW52aXJvbm1lbnQubXBzU2VydmVyLmluY2x1ZGVzKCcvbXBzJykpIHtcclxuICAgICAgLy9oYW5kbGVzIGtvbmcgcm91dGVcclxuICAgICAgdGhpcy5zZXJ2ZXIgPSBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXIucmVwbGFjZSgnaHR0cCcsICd3cycpfS93cy9yZWxheWA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMubG9nZ2VyID0gbmV3IENvbnNvbGVMb2dnZXIoMSk7XHJcbiAgICAvLyB0aGlzLmFjdGl2YXRlZFJvdXRlLnBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xyXG4gICAgLy8gICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAvLyAgIHRoaXMuZGV2aWNlSWQgPSBwYXJhbXMuaWQ7XHJcbiAgICAvLyB9KTtcclxuICAgIHRoaXMuc3RvcFNvY2tldFN1YnNjcmlwdGlvbiA9IHRoaXMuZGV2aWNlc1NlcnZpY2Uuc3RvcHdlYlNvY2tldC5zdWJzY3JpYmUoXHJcbiAgICAgICgpID0+IHtcclxuICAgICAgICB0aGlzLnN0b3BLdm0oKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICAgIHRoaXMuc3RhcnRTb2NrZXRTdWJzY3JpcHRpb24gPVxyXG4gICAgICB0aGlzLmRldmljZXNTZXJ2aWNlLmNvbm5lY3RLVk1Tb2NrZXQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLnNldEFtdEZlYXR1cmVzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgdGhpcy50aW1lSW50ZXJ2YWwgPSBpbnRlcnZhbCgxNTAwMClcclxuICAgICAgLnBpcGUobWVyZ2VNYXAoKCkgPT4gdGhpcy5kZXZpY2VzU2VydmljZS5nZXRQb3dlclN0YXRlKHRoaXMuZGV2aWNlSWQpKSlcclxuICAgICAgLnN1YnNjcmliZSgpO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZXRBbXRGZWF0dXJlcygpO1xyXG4gIH1cclxuXHJcbiAgaW5zdGFudGlhdGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcz8ubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdGhpcy5yZWRpcmVjdG9yID0gbmV3IEFNVEt2bURhdGFSZWRpcmVjdG9yKFxyXG4gICAgICB0aGlzLmxvZ2dlcixcclxuICAgICAgUHJvdG9jb2wuS1ZNLFxyXG4gICAgICBuZXcgRmlsZVJlYWRlcigpLFxyXG4gICAgICB0aGlzLmRldmljZUlkLFxyXG4gICAgICAxNjk5NCxcclxuICAgICAgJycsXHJcbiAgICAgICcnLFxyXG4gICAgICAwLFxyXG4gICAgICAwLFxyXG4gICAgICB0aGlzLmF1dGhTZXJ2aWNlLmdldExvZ2dlZFVzZXJUb2tlbigpLFxyXG4gICAgICB0aGlzLnNlcnZlclxyXG4gICAgKTtcclxuICAgIHRoaXMubW9kdWxlID0gbmV3IEFNVERlc2t0b3AodGhpcy5sb2dnZXIgYXMgYW55LCB0aGlzLmNvbnRleHQpO1xyXG4gICAgdGhpcy5kYXRhUHJvY2Vzc29yID0gbmV3IERhdGFQcm9jZXNzb3IoXHJcbiAgICAgIHRoaXMubG9nZ2VyLFxyXG4gICAgICB0aGlzLnJlZGlyZWN0b3IsXHJcbiAgICAgIHRoaXMubW9kdWxlXHJcbiAgICApO1xyXG4gICAgdGhpcy5tb3VzZUhlbHBlciA9IG5ldyBNb3VzZUhlbHBlcih0aGlzLm1vZHVsZSwgdGhpcy5yZWRpcmVjdG9yLCAyMDApO1xyXG4gICAgdGhpcy5rZXlib2FyZEhlbHBlciA9IG5ldyBLZXlCb2FyZEhlbHBlcih0aGlzLm1vZHVsZSwgdGhpcy5yZWRpcmVjdG9yKTtcclxuXHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25Qcm9jZXNzRGF0YSA9IHRoaXMubW9kdWxlLnByb2Nlc3NEYXRhLmJpbmQodGhpcy5tb2R1bGUpO1xyXG4gICAgdGhpcy5yZWRpcmVjdG9yLm9uU3RhcnQgPSB0aGlzLm1vZHVsZS5zdGFydC5iaW5kKHRoaXMubW9kdWxlKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vbk5ld1N0YXRlID0gdGhpcy5tb2R1bGUub25TdGF0ZUNoYW5nZS5iaW5kKHRoaXMubW9kdWxlKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vblNlbmRLdm1EYXRhID0gdGhpcy5tb2R1bGUub25TZW5kS3ZtRGF0YS5iaW5kKHRoaXMubW9kdWxlKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vblN0YXRlQ2hhbmdlZCA9IHRoaXMub25Db25uZWN0aW9uU3RhdGVDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vbkVycm9yID0gdGhpcy5vblJlZGlyZWN0b3JFcnJvci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5tb2R1bGUub25TZW5kID0gdGhpcy5yZWRpcmVjdG9yLnNlbmQuYmluZCh0aGlzLnJlZGlyZWN0b3IpO1xyXG4gICAgdGhpcy5tb2R1bGUub25Qcm9jZXNzRGF0YSA9IHRoaXMuZGF0YVByb2Nlc3Nvci5wcm9jZXNzRGF0YS5iaW5kKFxyXG4gICAgICB0aGlzLmRhdGFQcm9jZXNzb3JcclxuICAgICk7XHJcbiAgICB0aGlzLm1vZHVsZS5icHAgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgdGhpcy5tb3VzZU1vdmUgPSBmcm9tRXZlbnQodGhpcy5jYW52YXM/Lm5hdGl2ZUVsZW1lbnQsICdtb3VzZW1vdmUnKTtcclxuICAgIHRoaXMubW91c2VNb3ZlLnBpcGUodGhyb3R0bGVUaW1lKDIwMCkpLnN1YnNjcmliZSgoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5tb3VzZUhlbHBlciAhPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5tb3VzZUhlbHBlci5tb3VzZW1vdmUoZXZlbnQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uQ29ubmVjdGlvblN0YXRlQ2hhbmdlID0gKHJlZGlyZWN0b3I6IGFueSwgc3RhdGU6IG51bWJlcik6IGFueSA9PiB7XHJcbiAgICB0aGlzLmRldmljZVN0YXRlID0gc3RhdGU7XHJcbiAgICB0aGlzLmRldmljZVN0YXR1cy5lbWl0KHN0YXRlKTtcclxuICB9O1xyXG5cclxuICBvblJlZGlyZWN0b3JFcnJvcigpOiB2b2lkIHtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIGluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmRldmljZXNTZXJ2aWNlXHJcbiAgICAgIC5nZXRQb3dlclN0YXRlKHRoaXMuZGV2aWNlSWQpXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgICAgLy8gdGhpcy5zbmFja0Jhci5vcGVuKGBFcnJvciByZXRyaWV2aW5nIHBvd2VyIHN0YXR1c2AsIHVuZGVmaW5lZCwgU25hY2tiYXJEZWZhdWx0cy5kZWZhdWx0RXJyb3IpXHJcbiAgICAgICAgICByZXR1cm4gb2YoKTtcclxuICAgICAgICB9KSxcclxuICAgICAgICBmaW5hbGl6ZSgoKSA9PiB7fSlcclxuICAgICAgKVxyXG4gICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb3dlclN0YXRlID0gZGF0YTtcclxuICAgICAgICB0aGlzLmlzUG93ZXJlZE9uID0gdGhpcy5jaGVja1Bvd2VyU3RhdHVzKCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzUG93ZXJlZE9uKSB7XHJcbiAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgY29uc3QgZGlhbG9nID0gdGhpcy5kaWFsb2cub3BlbihQb3dlclVwQWxlcnRDb21wb25lbnQpO1xyXG4gICAgICAgICAgZGlhbG9nLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICB0aGlzLmRldmljZXNTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuc2VuZFBvd2VyQWN0aW9uKHRoaXMuZGV2aWNlSWQsIDIpXHJcbiAgICAgICAgICAgICAgICAucGlwZSgpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuaW5zdGFudGlhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF1dG9Db25uZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgIH0sIDQwMDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmluc3RhbnRpYXRlKCk7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hdXRvQ29ubmVjdCgpO1xyXG4gICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldEFtdEZlYXR1cmVzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgY29uc29sZS5sb2coJ2NvbWluZyBpbnNpZGUgaW4gc2V0QW10ZmVhdHVyZXMnKTtcclxuICAgIHRoaXMuZGV2aWNlc1NlcnZpY2VcclxuICAgICAgLnNldEFtdEZlYXR1cmVzKHRoaXMuZGV2aWNlSWQpXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgICAgLy8gdGhpcy5zbmFja0Jhci5vcGVuKGBFcnJvciBlbmFibGluZyBrdm1gLCB1bmRlZmluZWQsIFNuYWNrYmFyRGVmYXVsdHMuZGVmYXVsdEVycm9yKVxyXG4gICAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgICByZXR1cm4gb2YoKTtcclxuICAgICAgICB9KSxcclxuICAgICAgICBmaW5hbGl6ZSgoKSA9PiB7fSlcclxuICAgICAgKVxyXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuaW5pdCgpKTtcclxuICB9XHJcblxyXG4gIGF1dG9Db25uZWN0KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMucmVkaXJlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMucmVkaXJlY3Rvci5zdGFydChXZWJTb2NrZXQpO1xyXG4gICAgICB0aGlzLmtleWJvYXJkSGVscGVyLkdyYWJLZXlJbnB1dCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXHJcbiAgb25FbmNvZGluZ0NoYW5nZSAoKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0b3BLdm0oKVxyXG4gICAgdGltZXIoMTAwMCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5hdXRvQ29ubmVjdCgpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgY2hlY2tQb3dlclN0YXR1cygpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnBvd2VyU3RhdGUucG93ZXJzdGF0ZSA9PT0gMjtcclxuICB9XHJcblxyXG4gIHJlc2V0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgdGhpcy5yZWRpcmVjdG9yID0gbnVsbDtcclxuICAgIHRoaXMubW9kdWxlID0gbnVsbDtcclxuICAgIHRoaXMuZGF0YVByb2Nlc3NvciA9IG51bGw7XHJcbiAgICB0aGlzLmhlaWdodCA9IDQwMDtcclxuICAgIHRoaXMud2lkdGggPSA0MDA7XHJcbiAgICB0aGlzLmluc3RhbnRpYXRlKCk7XHJcbiAgfTtcclxuXHJcbiAgc3RvcEt2bSA9ICgpOiB2b2lkID0+IHtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5zdG9wKCk7XHJcbiAgICB0aGlzLmtleWJvYXJkSGVscGVyLlVuR3JhYktleUlucHV0KCk7XHJcbiAgICB0aGlzLnJlc2V0KCk7XHJcbiAgfTtcclxuXHJcbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRBY3Rpb24gIT09IHRoaXMucHJldmlvdXNBY3Rpb24pIHtcclxuICAgICAgdGhpcy5wcmV2aW91c0FjdGlvbiA9IHRoaXMuc2VsZWN0ZWRBY3Rpb247XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbk1vdXNldXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLm1vdXNlSGVscGVyICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5tb3VzZUhlbHBlci5tb3VzZXVwKGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uTW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5tb3VzZUhlbHBlciAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMubW91c2VIZWxwZXIubW91c2Vkb3duKGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95ICgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnRpbWVJbnRlcnZhbCkge1xyXG4gICAgICB0aGlzLnRpbWVJbnRlcnZhbC51bnN1YnNjcmliZSgpXHJcbiAgICB9XHJcbiAgICB0aGlzLnN0b3BLdm0oKVxyXG4gICAgaWYgKHRoaXMuc3RhcnRTb2NrZXRTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5zdGFydFNvY2tldFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpXHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5zdG9wU29ja2V0U3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuc3RvcFNvY2tldFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIjwhLS0gPGFtdC1kZXZpY2UtdG9vbGJhcj48L2FtdC1kZXZpY2UtdG9vbGJhcj4gLS0+XHJcbjxkaXY+XHJcbiAgICA8YnV0dG9uIHN0eWxlPVwiZGlzcGxheTogYmxvY2s7XCI+IGNvbm5lY3QgPC9idXR0b24+XHJcbiAgICA8Y2FudmFzIGNsYXNzPVwiY2FudmFzXCIgI2NhbnZhcyBbd2lkdGhdPVwid2lkdGhcIiBbaGVpZ2h0XT1cImhlaWdodFwiIG9uY29udGV4dG1lbnU9XCJyZXR1cm4gZmFsc2VcIiAobW91c2V1cCk9XCJvbk1vdXNldXAoJGV2ZW50KVwiIChtb3VzZWRvd24pPVwib25Nb3VzZWRvd24oJGV2ZW50KVwiPjwvY2FudmFzPlxyXG48L2Rpdj5cclxuXHJcbiJdfQ==