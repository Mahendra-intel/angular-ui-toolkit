import { Component, EventEmitter, Inject, Input, Output, ViewChild, } from '@angular/core';
import { AMTDesktop, AMTKvmDataRedirector, ConsoleLogger, DataProcessor, KeyBoardHelper, MouseHelper, Protocol, } from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { environment } from '../environments/environment';
import { fromEvent, timer } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import * as i0 from "@angular/core";
const _c0 = ["canvas"];
export class KvmComponent {
    constructor(params) {
        this.params = params;
        // //setting a width and height for the canvas
        this.width = 400;
        this.height = 400;
        this.deviceState = 0;
        this.deviceStatus = new EventEmitter();
        this.deviceConnection = new EventEmitter();
        this.selectedEncoding = new EventEmitter();
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
KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(i0.ɵɵdirectiveInject('userInput')); };
KvmComponent.ɵcmp = i0.ɵɵdefineComponent({ type: KvmComponent, selectors: [["amt-kvm"]], viewQuery: function KvmComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 1);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
    } }, inputs: { width: "width", height: "height", deviceConnection: "deviceConnection", selectedEncoding: "selectedEncoding" }, outputs: { deviceState: "deviceState", deviceStatus: "deviceStatus" }, decls: 3, vars: 2, consts: [["oncontextmenu", "return false", 1, "canvas", 3, "width", "height", "mouseup", "mousedown"], ["canvas", ""]], template: function KvmComponent_Template(rf, ctx) { if (rf & 1) {
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
    }], function () { return [{ type: undefined, decorators: [{
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
        }], selectedEncoding: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLGFBQWEsRUFDYixhQUFhLEVBR2IsY0FBYyxFQUNkLFdBQVcsRUFDWCxRQUFRLEdBQ1QsTUFBTSx5Q0FBeUMsQ0FBQztBQUNqRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBTzlDLE1BQU0sT0FBTyxZQUFZO0lBc0N2QixZQUM4QixNQUFNO1FBQU4sV0FBTSxHQUFOLE1BQU0sQ0FBQTtRQW5DcEMsOENBQThDO1FBRTlCLFVBQUssR0FBRyxHQUFHLENBQUM7UUFDWixXQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ25CLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLGlCQUFZLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFDekQscUJBQWdCLEdBQy9CLElBQUksWUFBWSxFQUFXLENBQUM7UUFDckIscUJBQWdCLEdBQTRCLElBQUksWUFBWSxFQUFVLENBQUM7UUFTaEYsZUFBVSxHQUFRLENBQUMsQ0FBQztRQUNwQixZQUFPLEdBQVcsWUFBWSxDQUFDO1FBQy9CLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCLGNBQVMsR0FBWSxL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Vzt3QkF0Q21CLE1BQU07a0JBQTdDLFNBQVM7bUJBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUt0QixLQUFLO2tCQUFwQixLQUFLO1lBQ1UsTUFBTTtrQkFBckIsS0FBSztZQUNJLFdBQVc7a0JBQXBCLE1BQU07WUFDRyxZQUFZO2tCQUFyQixNQUFNO1lBQ1UsZ0JBQWdCO2tCQUFoQyxLQUFLO1lBRUcsZ0JBQWdCO2tCQUF4QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENvbXBvbmVudCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbmplY3QsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIE9uSW5pdCxcclxuICBPdXRwdXQsXHJcbiAgVmlld0NoaWxkLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIEFNVERlc2t0b3AsXHJcbiAgQU1US3ZtRGF0YVJlZGlyZWN0b3IsXHJcbiAgQ29uc29sZUxvZ2dlcixcclxuICBEYXRhUHJvY2Vzc29yLFxyXG4gIElEYXRhUHJvY2Vzc29yLFxyXG4gIElMb2dnZXIsXHJcbiAgS2V5Qm9hcmRIZWxwZXIsXHJcbiAgTW91c2VIZWxwZXIsXHJcbiAgUHJvdG9jb2wsXHJcbn0gZnJvbSAnQG9wZW4tYW10LWNsb3VkLXRvb2xraXQvdWktdG9vbGtpdC9jb3JlJztcclxuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiwgdGltZXIgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGhyb3R0bGVUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhbXQta3ZtJyxcclxuICB0ZW1wbGF0ZVVybDogJy4va3ZtLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9rdm0uY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgS3ZtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xyXG4gIEBWaWV3Q2hpbGQoJ2NhbnZhcycsIHsgc3RhdGljOiBmYWxzZSB9KSBjYW52YXM6IEVsZW1lbnRSZWYgfCB1bmRlZmluZWQ7XHJcbiAgcHVibGljIGNvbnRleHQhOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG4gIC8vIC8vc2V0dGluZyBhIHdpZHRoIGFuZCBoZWlnaHQgZm9yIHRoZSBjYW52YXNcclxuXHJcbiAgQElucHV0KCkgcHVibGljIHdpZHRoID0gNDAwO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBoZWlnaHQgPSA0MDA7XHJcbiAgQE91dHB1dCgpIGRldmljZVN0YXRlOiBudW1iZXIgPSAwO1xyXG4gIEBPdXRwdXQoKSBkZXZpY2VTdGF0dXM6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XHJcbiAgQElucHV0KCkgcHJpdmF0ZSBkZXZpY2VDb25uZWN0aW9uOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPVxyXG4gICAgbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xyXG4gIEBJbnB1dCgpIHNlbGVjdGVkRW5jb2RpbmcgOiAgIEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XHJcbiAgc3RvcFNvY2tldFN1YnNjcmlwdGlvbiE6IFN1YnNjcmlwdGlvbjtcclxuICBzdGFydFNvY2tldFN1YnNjcmlwdGlvbiE6IFN1YnNjcmlwdGlvbjtcclxuICBtb2R1bGU6IGFueTtcclxuICByZWRpcmVjdG9yOiBhbnk7XHJcbiAgZGF0YVByb2Nlc3NvciE6IElEYXRhUHJvY2Vzc29yIHwgbnVsbDtcclxuICBtb3VzZUhlbHBlciE6IE1vdXNlSGVscGVyO1xyXG4gIGtleWJvYXJkSGVscGVyITogS2V5Qm9hcmRIZWxwZXI7XHJcbiAgbG9nZ2VyITogSUxvZ2dlcjtcclxuICBwb3dlclN0YXRlOiBhbnkgPSAwO1xyXG4gIGJ0blRleHQ6IHN0cmluZyA9ICdEaXNjb25uZWN0JztcclxuICBpc1Bvd2VyZWRPbjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGRldmljZUlkOiBzdHJpbmcgPSAnJztcclxuICBzZWxlY3RlZDogbnVtYmVyID0gMTtcclxuICB0aW1lSW50ZXJ2YWwhOiBhbnk7XHJcbiAgc2VydmVyOiBzdHJpbmcgPSBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXIucmVwbGFjZSgnaHR0cCcsICd3cycpfS9yZWxheWA7XHJcbiAgcHJldmlvdXNBY3Rpb24gPSAna3ZtJztcclxuICBzZWxlY3RlZEFjdGlvbiA9ICcnO1xyXG4gIG1vdXNlTW92ZTogYW55ID0gbnVsbDtcclxuXHJcbiAgZW5jb2RpbmdzID0gW1xyXG4gICAgeyB2YWx1ZTogMSwgdmlld1ZhbHVlOiAnUkxFIDgnIH0sXHJcbiAgICB7IHZhbHVlOiAyLCB2aWV3VmFsdWU6ICdSTEUgMTYnIH0sXHJcbiAgXTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBASW5qZWN0KCd1c2VySW5wdXQnKSBwdWJsaWMgcGFyYW1zXHJcbiAgKSB7XHJcbiAgICB0aGlzLmRldmljZUlkID0gdGhpcy5wYXJhbXMuZGV2aWNlSWQ7XHJcbiAgICBpZiAoZW52aXJvbm1lbnQubXBzU2VydmVyLmluY2x1ZGVzKCcvbXBzJykpIHtcclxuICAgICAgLy9oYW5kbGVzIGtvbmcgcm91dGVcclxuICAgICAgdGhpcy5zZXJ2ZXIgPSBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXIucmVwbGFjZSgnaHR0cCcsICd3cycpfS93cy9yZWxheWA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMubG9nZ2VyID0gbmV3IENvbnNvbGVMb2dnZXIoMSk7XHJcbiAgICB0aGlzLmRldmljZUNvbm5lY3Rpb24uc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhID09PSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zdG9wS3ZtKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBpbnN0YW50aWF0ZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzPy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3IgPSBuZXcgQU1US3ZtRGF0YVJlZGlyZWN0b3IoXHJcbiAgICAgIHRoaXMubG9nZ2VyLFxyXG4gICAgICBQcm90b2NvbC5LVk0sXHJcbiAgICAgIG5ldyBGaWxlUmVhZGVyKCksXHJcbiAgICAgIHRoaXMuZGV2aWNlSWQsXHJcbiAgICAgIDE2OTk0LFxyXG4gICAgICAnJyxcclxuICAgICAgJycsXHJcbiAgICAgIDAsXHJcbiAgICAgIDAsXHJcbiAgICAgIHRoaXMucGFyYW1zLmF1dGhUb2tlbixcclxuICAgICAgdGhpcy5zZXJ2ZXJcclxuICAgICk7XHJcbiAgICB0aGlzLm1vZHVsZSA9IG5ldyBBTVREZXNrdG9wKHRoaXMubG9nZ2VyIGFzIGFueSwgdGhpcy5jb250ZXh0KTtcclxuICAgIHRoaXMuZGF0YVByb2Nlc3NvciA9IG5ldyBEYXRhUHJvY2Vzc29yKFxyXG4gICAgICB0aGlzLmxvZ2dlcixcclxuICAgICAgdGhpcy5yZWRpcmVjdG9yLFxyXG4gICAgICB0aGlzLm1vZHVsZVxyXG4gICAgKTtcclxuICAgIHRoaXMubW91c2VIZWxwZXIgPSBuZXcgTW91c2VIZWxwZXIodGhpcy5tb2R1bGUsIHRoaXMucmVkaXJlY3RvciwgMjAwKTtcclxuICAgIHRoaXMua2V5Ym9hcmRIZWxwZXIgPSBuZXcgS2V5Qm9hcmRIZWxwZXIodGhpcy5tb2R1bGUsIHRoaXMucmVkaXJlY3Rvcik7XHJcblxyXG4gICAgdGhpcy5yZWRpcmVjdG9yLm9uUHJvY2Vzc0RhdGEgPSB0aGlzLm1vZHVsZS5wcm9jZXNzRGF0YS5iaW5kKHRoaXMubW9kdWxlKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vblN0YXJ0ID0gdGhpcy5tb2R1bGUuc3RhcnQuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25OZXdTdGF0ZSA9IHRoaXMubW9kdWxlLm9uU3RhdGVDaGFuZ2UuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25TZW5kS3ZtRGF0YSA9IHRoaXMubW9kdWxlLm9uU2VuZEt2bURhdGEuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25TdGF0ZUNoYW5nZWQgPSB0aGlzLm9uQ29ubmVjdGlvblN0YXRlQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25FcnJvciA9IHRoaXMub25SZWRpcmVjdG9yRXJyb3IuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubW9kdWxlLm9uU2VuZCA9IHRoaXMucmVkaXJlY3Rvci5zZW5kLmJpbmQodGhpcy5yZWRpcmVjdG9yKTtcclxuICAgIHRoaXMubW9kdWxlLm9uUHJvY2Vzc0RhdGEgPSB0aGlzLmRhdGFQcm9jZXNzb3IucHJvY2Vzc0RhdGEuYmluZChcclxuICAgICAgdGhpcy5kYXRhUHJvY2Vzc29yXHJcbiAgICApO1xyXG4gICAgdGhpcy5tb2R1bGUuYnBwID0gdGhpcy5zZWxlY3RlZDtcclxuICAgIHRoaXMubW91c2VNb3ZlID0gZnJvbUV2ZW50KHRoaXMuY2FudmFzPy5uYXRpdmVFbGVtZW50LCAnbW91c2Vtb3ZlJyk7XHJcbiAgICB0aGlzLm1vdXNlTW92ZS5waXBlKHRocm90dGxlVGltZSgyMDApKS5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgaWYgKHRoaXMubW91c2VIZWxwZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMubW91c2VIZWxwZXIubW91c2Vtb3ZlKGV2ZW50KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZSA9IChyZWRpcmVjdG9yOiBhbnksIHN0YXRlOiBudW1iZXIpOiBhbnkgPT4ge1xyXG4gICAgdGhpcy5kZXZpY2VTdGF0ZSA9IHN0YXRlO1xyXG4gICAgdGhpcy5kZXZpY2VTdGF0dXMuZW1pdChzdGF0ZSk7XHJcbiAgfTtcclxuXHJcbiAgb25SZWRpcmVjdG9yRXJyb3IoKTogdm9pZCB7XHJcbiAgICB0aGlzLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBpbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbnN0YW50aWF0ZSgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuYXV0b0Nvbm5lY3QoKTtcclxuICAgIH0sIDQwMDApO1xyXG4gIH1cclxuXHJcbiAgYXV0b0Nvbm5lY3QoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5yZWRpcmVjdG9yICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5yZWRpcmVjdG9yLnN0YXJ0KFdlYlNvY2tldCk7XHJcbiAgICAgIHRoaXMua2V5Ym9hcmRIZWxwZXIuR3JhYktleUlucHV0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkVuY29kaW5nQ2hhbmdlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zdG9wS3ZtKCk7XHJcbiAgICB0aW1lcigxMDAwKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmF1dG9Db25uZWN0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoZWNrUG93ZXJTdGF0dXMoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5wb3dlclN0YXRlLnBvd2Vyc3RhdGUgPT09IDI7XHJcbiAgfVxyXG5cclxuICByZXNldCA9ICgpOiB2b2lkID0+IHtcclxuICAgIHRoaXMucmVkaXJlY3RvciA9IG51bGw7XHJcbiAgICB0aGlzLm1vZHVsZSA9IG51bGw7XHJcbiAgICB0aGlzLmRhdGFQcm9jZXNzb3IgPSBudWxsO1xyXG4gICAgdGhpcy5oZWlnaHQgPSA0MDA7XHJcbiAgICB0aGlzLndpZHRoID0gNDAwO1xyXG4gICAgdGhpcy5pbnN0YW50aWF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIHN0b3BLdm0gPSAoKTogdm9pZCA9PiB7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iuc3RvcCgpO1xyXG4gICAgdGhpcy5rZXlib2FyZEhlbHBlci5VbkdyYWJLZXlJbnB1dCgpO1xyXG4gICAgdGhpcy5yZXNldCgpO1xyXG4gIH07XHJcblxyXG4gIG9uTW91c2V1cChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubW91c2VIZWxwZXIgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLm1vdXNlSGVscGVyLm1vdXNldXAoZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLm1vdXNlSGVscGVyICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5tb3VzZUhlbHBlci5tb3VzZWRvd24oZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0b3BLdm0oKTtcclxuICB9XHJcbn1cclxuIiwiPGRpdj5cclxuICA8Y2FudmFzXHJcbiAgICBjbGFzcz1cImNhbnZhc1wiXHJcbiAgICAjY2FudmFzXHJcbiAgICBbd2lkdGhdPVwid2lkdGhcIlxyXG4gICAgW2hlaWdodF09XCJoZWlnaHRcIlxyXG4gICAgb25jb250ZXh0bWVudT1cInJldHVybiBmYWxzZVwiXHJcbiAgICAobW91c2V1cCk9XCJvbk1vdXNldXAoJGV2ZW50KVwiXHJcbiAgICAobW91c2Vkb3duKT1cIm9uTW91c2Vkb3duKCRldmVudClcIlxyXG4gID48L2NhbnZhcz5cclxuPC9kaXY+XHJcbiJdfQ==