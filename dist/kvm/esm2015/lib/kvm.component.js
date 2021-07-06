import { Component, EventEmitter, Inject, Input, Output, ViewChild, } from '@angular/core';
import { AMTDesktop, AMTKvmDataRedirector, ConsoleLogger, DataProcessor, KeyBoardHelper, MouseHelper, Protocol, } from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { environment } from '../environments/environment';
import { fromEvent, timer } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
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
        this.deviceConnection = new EventEmitter();
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
        this.deviceConnection.subscribe((data) => {
            if (data === true) {
                this.init();
            }
            else {
                this.stopKvm();
            }
        });
    }
    ngAfterViewInit() {
        this.init();
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
        this.instantiate();
        setTimeout(() => {
            this.isLoading = false;
            this.autoConnect();
        }, 4000);
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
        this.stopKvm();
    }
}
KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(i0.ɵɵdirectiveInject(i1.MatSnackBar), i0.ɵɵdirectiveInject(i2.MatDialog), i0.ɵɵdirectiveInject(i3.KvmService), i0.ɵɵdirectiveInject('userInput')); };
KvmComponent.ɵcmp = i0.ɵɵdefineComponent({ type: KvmComponent, selectors: [["amt-kvm"]], viewQuery: function KvmComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 1);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
    } }, inputs: { width: "width", height: "height", deviceConnection: "deviceConnection" }, outputs: { deviceState: "deviceState", deviceStatus: "deviceStatus" }, decls: 3, vars: 2, consts: [["oncontextmenu", "return false", 1, "canvas", 3, "width", "height", "mouseup", "mousedown"], ["canvas", ""]], template: function KvmComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div");
        i0.ɵɵelementStart(1, "canvas", 0, 1);
        i0.ɵɵlistener("mouseup", function KvmComponent_Template_canvas_mouseup_1_listener($event) { return ctx.onMouseup($event); })("mousedown", function KvmComponent_Template_canvas_mousedown_1_listener($event) { return ctx.onMousedown($event); });
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("width", ctx.width)("height", ctx.height);
    } }, styles: [".canvas[_ngcontent-%COMP%]{max-height:80%;max-width:100%}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmComponent, [{
        type: Component,
        args: [{
                selector: 'amt-kvm',
                templateUrl: './kvm.component.html',
                styleUrls: ['./kvm.component.css'],
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
        }], deviceConnection: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLGFBQWEsRUFDYixhQUFhLEVBR2IsY0FBYyxFQUNkLFdBQVcsRUFDWCxRQUFRLEdBQ1QsTUFBTSx5Q0FBeUMsQ0FBQztBQUNqRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFMUQsT0FBTyxFQUFFLFNBQVMsRUFBOEIsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BFLE9BQU8sRUFBa0MsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7OztBQVc5RSxNQUFNLE9BQU8sWUFBWTtJQXFDdkIsWUFDUyxRQUFxQixFQUNyQixNQUFpQixFQUNQLGNBQTBCLEVBQ2YsTUFBTTtRQUgzQixhQUFRLEdBQVIsUUFBUSxDQUFhO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQVc7UUFDUCxtQkFBYyxHQUFkLGNBQWMsQ0FBWTtRQUNmLFdBQU0sR0FBTixNQUFNLENBQUE7UUFyQ3BDLDhDQUE4QztRQUU5QixVQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ1osV0FBTSxHQUFHLEdBQUcsQ0FBQztRQUNuQixnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixpQkFBWSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3pELHFCQUFnQixHQUMvQixJQUFJLFlBQVksRUFBVyxDQUFDO1FBUzlCLGVBQVUsR0FBUSxDQUFD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QkFBbUIsSUFESDtRQUU5QixpQkFBUztRQUNaLGlCQUFNOztRQU5GLGVBQWU7UUFBZixpQ0FBZSxzQkFBQTs7dUZEaUNOLFlBQVk7Y0FMeEIsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxTQUFTO2dCQUNuQixXQUFXLEVBQUUsc0JBQXNCO2dCQUNuQyxTQUFTLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQzthQUNuQzs7c0JBMENJLE1BQU07dUJBQUMsV0FBVzt3QkF4Q21CLE1BQU07a0JBQTdDLFNBQVM7bUJBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUt0QixLQUFLO2tCQUFwQixLQUFLO1lBQ1UsTUFBTTtrQkFBckIsS0FBSztZQUNJLFdBQVc7a0JBQXBCLE1BQU07WUFDRyxZQUFZO2tCQUFyQixNQUFNO1lBQ1UsZ0JBQWdCO2tCQUFoQyxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENvbXBvbmVudCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbmplY3QsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIE9uSW5pdCxcclxuICBPdXRwdXQsXHJcbiAgVmlld0NoaWxkLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIEFNVERlc2t0b3AsXHJcbiAgQU1US3ZtRGF0YVJlZGlyZWN0b3IsXHJcbiAgQ29uc29sZUxvZ2dlcixcclxuICBEYXRhUHJvY2Vzc29yLFxyXG4gIElEYXRhUHJvY2Vzc29yLFxyXG4gIElMb2dnZXIsXHJcbiAgS2V5Qm9hcmRIZWxwZXIsXHJcbiAgTW91c2VIZWxwZXIsXHJcbiAgUHJvdG9jb2wsXHJcbn0gZnJvbSAnQG9wZW4tYW10LWNsb3VkLXRvb2xraXQvdWktdG9vbGtpdC9jb3JlJztcclxuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBLdm1TZXJ2aWNlIH0gZnJvbSAnLi9rdm0uc2VydmljZSc7XHJcbmltcG9ydCB7IGZyb21FdmVudCwgaW50ZXJ2YWwsIG9mLCBTdWJzY3JpcHRpb24sIHRpbWVyIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGZpbmFsaXplLCBtZXJnZU1hcCwgdGhyb3R0bGVUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2cgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xyXG5pbXBvcnQgeyBNYXRTbmFja0JhciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NuYWNrLWJhcic7XHJcbmltcG9ydCB7IFBvd2VyVXBBbGVydENvbXBvbmVudCB9IGZyb20gJy4vc2hhcmVkL3Bvd2VyLXVwLWFsZXJ0L3Bvd2VyLXVwLWFsZXJ0LmNvbXBvbmVudCc7XHJcbmltcG9ydCBTbmFja2JhckRlZmF1bHRzIGZyb20gJy4vc2hhcmVkL2NvbmZpZy9zbmFja0JhckRlZmF1bHQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhbXQta3ZtJyxcclxuICB0ZW1wbGF0ZVVybDogJy4va3ZtLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9rdm0uY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgS3ZtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xyXG4gIEBWaWV3Q2hpbGQoJ2NhbnZhcycsIHsgc3RhdGljOiBmYWxzZSB9KSBjYW52YXM6IEVsZW1lbnRSZWYgfCB1bmRlZmluZWQ7XHJcbiAgcHVibGljIGNvbnRleHQhOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG4gIC8vIC8vc2V0dGluZyBhIHdpZHRoIGFuZCBoZWlnaHQgZm9yIHRoZSBjYW52YXNcclxuXHJcbiAgQElucHV0KCkgcHVibGljIHdpZHRoID0gNDAwO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBoZWlnaHQgPSA0MDA7XHJcbiAgQE91dHB1dCgpIGRldmljZVN0YXRlOiBudW1iZXIgPSAwO1xyXG4gIEBPdXRwdXQoKSBkZXZpY2VTdGF0dXM6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XHJcbiAgQElucHV0KCkgcHJpdmF0ZSBkZXZpY2VDb25uZWN0aW9uOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPVxyXG4gICAgbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xyXG4gIHN0b3BTb2NrZXRTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XHJcbiAgc3RhcnRTb2NrZXRTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XHJcbiAgbW9kdWxlOiBhbnk7XHJcbiAgcmVkaXJlY3RvcjogYW55O1xyXG4gIGRhdGFQcm9jZXNzb3IhOiBJRGF0YVByb2Nlc3NvciB8IG51bGw7XHJcbiAgbW91c2VIZWxwZXIhOiBNb3VzZUhlbHBlcjtcclxuICBrZXlib2FyZEhlbHBlciE6IEtleUJvYXJkSGVscGVyO1xyXG4gIGxvZ2dlciE6IElMb2dnZXI7XHJcbiAgcG93ZXJTdGF0ZTogYW55ID0gMDtcclxuICBidG5UZXh0OiBzdHJpbmcgPSAnRGlzY29ubmVjdCc7XHJcbiAgaXNQb3dlcmVkT246IGJvb2xlYW4gPSBmYWxzZTtcclxuICBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBkZXZpY2VJZDogc3RyaW5nID0gJyc7XHJcbiAgc2VsZWN0ZWQ6IG51bWJlciA9IDE7XHJcbiAgdGltZUludGVydmFsITogYW55O1xyXG4gIHNlcnZlcjogc3RyaW5nID0gYCR7ZW52aXJvbm1lbnQubXBzU2VydmVyLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKX0vcmVsYXlgO1xyXG4gIHByZXZpb3VzQWN0aW9uID0gJ2t2bSc7XHJcbiAgc2VsZWN0ZWRBY3Rpb24gPSAnJztcclxuICBtb3VzZU1vdmU6IGFueSA9IG51bGw7XHJcblxyXG4gIGVuY29kaW5ncyA9IFtcclxuICAgIHsgdmFsdWU6IDEsIHZpZXdWYWx1ZTogJ1JMRSA4JyB9LFxyXG4gICAgeyB2YWx1ZTogMiwgdmlld1ZhbHVlOiAnUkxFIDE2JyB9LFxyXG4gIF07XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIHNuYWNrQmFyOiBNYXRTbmFja0JhcixcclxuICAgIHB1YmxpYyBkaWFsb2c6IE1hdERpYWxvZyxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGV2aWNlc1NlcnZpY2U6IEt2bVNlcnZpY2UsXHJcbiAgICBASW5qZWN0KCd1c2VySW5wdXQnKSBwdWJsaWMgcGFyYW1zXHJcbiAgKSB7XHJcbiAgICB0aGlzLmRldmljZUlkID0gdGhpcy5wYXJhbXMuZGV2aWNlSWQ7XHJcbiAgICBpZiAoZW52aXJvbm1lbnQubXBzU2VydmVyLmluY2x1ZGVzKCcvbXBzJykpIHtcclxuICAgICAgLy9oYW5kbGVzIGtvbmcgcm91dGVcclxuICAgICAgdGhpcy5zZXJ2ZXIgPSBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXIucmVwbGFjZSgnaHR0cCcsICd3cycpfS93cy9yZWxheWA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMubG9nZ2VyID0gbmV3IENvbnNvbGVMb2dnZXIoMSk7XHJcbiAgICB0aGlzLmRldmljZUNvbm5lY3Rpb24uc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhID09PSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zdG9wS3ZtKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBpbnN0YW50aWF0ZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzPy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3IgPSBuZXcgQU1US3ZtRGF0YVJlZGlyZWN0b3IoXHJcbiAgICAgIHRoaXMubG9nZ2VyLFxyXG4gICAgICBQcm90b2NvbC5LVk0sXHJcbiAgICAgIG5ldyBGaWxlUmVhZGVyKCksXHJcbiAgICAgIHRoaXMuZGV2aWNlSWQsXHJcbiAgICAgIDE2OTk0LFxyXG4gICAgICAnJyxcclxuICAgICAgJycsXHJcbiAgICAgIDAsXHJcbiAgICAgIDAsXHJcbiAgICAgIHRoaXMucGFyYW1zLmF1dGhUb2tlbixcclxuICAgICAgdGhpcy5zZXJ2ZXJcclxuICAgICk7XHJcbiAgICB0aGlzLm1vZHVsZSA9IG5ldyBBTVREZXNrdG9wKHRoaXMubG9nZ2VyIGFzIGFueSwgdGhpcy5jb250ZXh0KTtcclxuICAgIHRoaXMuZGF0YVByb2Nlc3NvciA9IG5ldyBEYXRhUHJvY2Vzc29yKFxyXG4gICAgICB0aGlzLmxvZ2dlcixcclxuICAgICAgdGhpcy5yZWRpcmVjdG9yLFxyXG4gICAgICB0aGlzLm1vZHVsZVxyXG4gICAgKTtcclxuICAgIHRoaXMubW91c2VIZWxwZXIgPSBuZXcgTW91c2VIZWxwZXIodGhpcy5tb2R1bGUsIHRoaXMucmVkaXJlY3RvciwgMjAwKTtcclxuICAgIHRoaXMua2V5Ym9hcmRIZWxwZXIgPSBuZXcgS2V5Qm9hcmRIZWxwZXIodGhpcy5tb2R1bGUsIHRoaXMucmVkaXJlY3Rvcik7XHJcblxyXG4gICAgdGhpcy5yZWRpcmVjdG9yLm9uUHJvY2Vzc0RhdGEgPSB0aGlzLm1vZHVsZS5wcm9jZXNzRGF0YS5iaW5kKHRoaXMubW9kdWxlKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vblN0YXJ0ID0gdGhpcy5tb2R1bGUuc3RhcnQuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25OZXdTdGF0ZSA9IHRoaXMubW9kdWxlLm9uU3RhdGVDaGFuZ2UuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25TZW5kS3ZtRGF0YSA9IHRoaXMubW9kdWxlLm9uU2VuZEt2bURhdGEuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25TdGF0ZUNoYW5nZWQgPSB0aGlzLm9uQ29ubmVjdGlvblN0YXRlQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25FcnJvciA9IHRoaXMub25SZWRpcmVjdG9yRXJyb3IuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubW9kdWxlLm9uU2VuZCA9IHRoaXMucmVkaXJlY3Rvci5zZW5kLmJpbmQodGhpcy5yZWRpcmVjdG9yKTtcclxuICAgIHRoaXMubW9kdWxlLm9uUHJvY2Vzc0RhdGEgPSB0aGlzLmRhdGFQcm9jZXNzb3IucHJvY2Vzc0RhdGEuYmluZChcclxuICAgICAgdGhpcy5kYXRhUHJvY2Vzc29yXHJcbiAgICApO1xyXG4gICAgdGhpcy5tb2R1bGUuYnBwID0gdGhpcy5zZWxlY3RlZDtcclxuICAgIHRoaXMubW91c2VNb3ZlID0gZnJvbUV2ZW50KHRoaXMuY2FudmFzPy5uYXRpdmVFbGVtZW50LCAnbW91c2Vtb3ZlJyk7XHJcbiAgICB0aGlzLm1vdXNlTW92ZS5waXBlKHRocm90dGxlVGltZSgyMDApKS5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgaWYgKHRoaXMubW91c2VIZWxwZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMubW91c2VIZWxwZXIubW91c2Vtb3ZlKGV2ZW50KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZSA9IChyZWRpcmVjdG9yOiBhbnksIHN0YXRlOiBudW1iZXIpOiBhbnkgPT4ge1xyXG4gICAgdGhpcy5kZXZpY2VTdGF0ZSA9IHN0YXRlO1xyXG4gICAgdGhpcy5kZXZpY2VTdGF0dXMuZW1pdChzdGF0ZSk7XHJcbiAgfTtcclxuXHJcbiAgb25SZWRpcmVjdG9yRXJyb3IoKTogdm9pZCB7XHJcbiAgICB0aGlzLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBpbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbnN0YW50aWF0ZSgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuYXV0b0Nvbm5lY3QoKTtcclxuICAgIH0sIDQwMDApO1xyXG4gIH1cclxuXHJcbiAgYXV0b0Nvbm5lY3QoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5yZWRpcmVjdG9yICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5yZWRpcmVjdG9yLnN0YXJ0KFdlYlNvY2tldCk7XHJcbiAgICAgIHRoaXMua2V5Ym9hcmRIZWxwZXIuR3JhYktleUlucHV0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkVuY29kaW5nQ2hhbmdlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zdG9wS3ZtKCk7XHJcbiAgICB0aW1lcigxMDAwKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmF1dG9Db25uZWN0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoZWNrUG93ZXJTdGF0dXMoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5wb3dlclN0YXRlLnBvd2Vyc3RhdGUgPT09IDI7XHJcbiAgfVxyXG5cclxuICByZXNldCA9ICgpOiB2b2lkID0+IHtcclxuICAgIHRoaXMucmVkaXJlY3RvciA9IG51bGw7XHJcbiAgICB0aGlzLm1vZHVsZSA9IG51bGw7XHJcbiAgICB0aGlzLmRhdGFQcm9jZXNzb3IgPSBudWxsO1xyXG4gICAgdGhpcy5oZWlnaHQgPSA0MDA7XHJcbiAgICB0aGlzLndpZHRoID0gNDAwO1xyXG4gICAgdGhpcy5pbnN0YW50aWF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIHN0b3BLdm0gPSAoKTogdm9pZCA9PiB7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iuc3RvcCgpO1xyXG4gICAgdGhpcy5rZXlib2FyZEhlbHBlci5VbkdyYWJLZXlJbnB1dCgpO1xyXG4gICAgdGhpcy5yZXNldCgpO1xyXG4gIH07XHJcblxyXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkQWN0aW9uICE9PSB0aGlzLnByZXZpb3VzQWN0aW9uKSB7XHJcbiAgICAgIHRoaXMucHJldmlvdXNBY3Rpb24gPSB0aGlzLnNlbGVjdGVkQWN0aW9uO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25Nb3VzZXVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5tb3VzZUhlbHBlciAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMubW91c2VIZWxwZXIubW91c2V1cChldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbk1vdXNlZG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubW91c2VIZWxwZXIgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLm1vdXNlSGVscGVyLm1vdXNlZG93bihldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMuc3RvcEt2bSgpO1xyXG4gIH1cclxufVxyXG4iLCI8ZGl2PlxyXG4gIDxjYW52YXNcclxuICAgIGNsYXNzPVwiY2FudmFzXCJcclxuICAgICNjYW52YXNcclxuICAgIFt3aWR0aF09XCJ3aWR0aFwiXHJcbiAgICBbaGVpZ2h0XT1cImhlaWdodFwiXHJcbiAgICBvbmNvbnRleHRtZW51PVwicmV0dXJuIGZhbHNlXCJcclxuICAgIChtb3VzZXVwKT1cIm9uTW91c2V1cCgkZXZlbnQpXCJcclxuICAgIChtb3VzZWRvd24pPVwib25Nb3VzZWRvd24oJGV2ZW50KVwiXHJcbiAgPjwvY2FudmFzPlxyXG48L2Rpdj5cclxuIl19