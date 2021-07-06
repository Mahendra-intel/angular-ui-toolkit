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
        this.selectedEncoding.subscribe((data) => {
            this.selected = data;
            this.onEncodingChange();
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
    onMousemove(event) {
        if (this.mouseHelper != null) {
            this.mouseHelper.mousemove(event);
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
    } }, inputs: { width: "width", height: "height", deviceConnection: "deviceConnection", selectedEncoding: "selectedEncoding" }, outputs: { deviceState: "deviceState", deviceStatus: "deviceStatus" }, decls: 3, vars: 2, consts: [["oncontextmenu", "return false", 1, "canvas", 3, "width", "height", "mouseup", "mousedown", "mousemove"], ["canvas", ""]], template: function KvmComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div");
        i0.ɵɵelementStart(1, "canvas", 0, 1);
        i0.ɵɵlistener("mouseup", function KvmComponent_Template_canvas_mouseup_1_listener($event) { return ctx.onMouseup($event); })("mousedown", function KvmComponent_Template_canvas_mousedown_1_listener($event) { return ctx.onMousedown($event); })("mousemove", function KvmComponent_Template_canvas_mousemove_1_listener($event) { return ctx.onMousemove($event); });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLGFBQWEsRUFDYixhQUFhLEVBR2IsY0FBYyxFQUNkLFdBQVcsRUFDWCxRQUFRLEdBQ1QsTUFBTSx5Q0FBeUMsQ0FBQztBQUNqRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBTzlDLE1BQU0sT0FBTyxZQUFZO0lBc0N2QixZQUF3QyxNQUFNO1FBQU4sV0FBTSxHQUFOLE1BQU0sQ0FBQTtRQWxDOUMsOENBQThDO1FBRTlCLFVBQUssR0FBRyxHQUFHLENBQUM7UUFDWixXQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ25CLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLGlCQUFZLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFDekQscUJBQWdCLEdBQy9CLElBQUksWUFBWSxFQUFXLENBQUM7UUFDckIscUJBQWdCLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFTN0UsZUFBVSxHQUFRLENBQUMsQ0FBQztRQUNwQixZQUFPLEdBQVcsWUFBWSxDQUFDO1FBQy9CLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCLGNBQVMsR0FBWSxL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LFdBQVc7aURBdENwQixZQUFZOzs7Ozs7UUNoQ3pCLDJCQUFLO1FBQ0gsb0NBU0M7UUFIQyxtR0FBVyxxQkFBaUIsSUFBQywwRkFDaEIsdUJBQW1CLElBREgsMEZBRWhCLHVCQUFtQixJQUZIO1FBRzlCLGlCQUFTO1FBQ1osaUJBQU07O1FBUEYsZUFBZTtRQUFmLGlDQUFlLHNCQUFBOzt1RkQ0Qk4sWUFBWTtjQUx4QixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLFdBQVcsRUFBRSxzQkFBc0I7Z0JBQ25DLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO2FBQ25DOztzQkF1Q2MsTUFBTTt1QkFBQyxXQUFXO3dCQXJDUyxNQUFNO2tCQUE3QyxTQUFTO21CQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7WUFLdEIsS0FBSztrQkFBcEIsS0FBSztZQUNVLE1BQU07a0JBQXJCLEtBQUs7WUFDSSxXQUFXO2tCQUFwQixNQUFNO1lBQ0csWUFBWTtrQkFBckIsTUFBTTtZQUNVLGdCQUFnQjtrQkFBaEMsS0FBSztZQUVHLGdCQUFnQjtrQkFBeEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBDb21wb25lbnQsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSW5qZWN0LFxyXG4gIElucHV0LFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFZpZXdDaGlsZCxcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICBBTVREZXNrdG9wLFxyXG4gIEFNVEt2bURhdGFSZWRpcmVjdG9yLFxyXG4gIENvbnNvbGVMb2dnZXIsXHJcbiAgRGF0YVByb2Nlc3NvcixcclxuICBJRGF0YVByb2Nlc3NvcixcclxuICBJTG9nZ2VyLFxyXG4gIEtleUJvYXJkSGVscGVyLFxyXG4gIE1vdXNlSGVscGVyLFxyXG4gIFByb3RvY29sLFxyXG59IGZyb20gJ0BvcGVuLWFtdC1jbG91ZC10b29sa2l0L3VpLXRvb2xraXQvY29yZSc7XHJcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJzY3JpcHRpb24sIHRpbWVyIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IHRocm90dGxlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYW10LWt2bScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2t2bS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4va3ZtLmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEt2bUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcclxuICBAVmlld0NoaWxkKCdjYW52YXMnLCB7IHN0YXRpYzogZmFsc2UgfSkgY2FudmFzOiBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xyXG4gIHB1YmxpYyBjb250ZXh0ITogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuICAvLyAvL3NldHRpbmcgYSB3aWR0aCBhbmQgaGVpZ2h0IGZvciB0aGUgY2FudmFzXHJcblxyXG4gIEBJbnB1dCgpIHB1YmxpYyB3aWR0aCA9IDQwMDtcclxuICBASW5wdXQoKSBwdWJsaWMgaGVpZ2h0ID0gNDAwO1xyXG4gIEBPdXRwdXQoKSBkZXZpY2VTdGF0ZTogbnVtYmVyID0gMDtcclxuICBAT3V0cHV0KCkgZGV2aWNlU3RhdHVzOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xyXG4gIEBJbnB1dCgpIHByaXZhdGUgZGV2aWNlQ29ubmVjdGlvbjogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID1cclxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcclxuICBASW5wdXQoKSBzZWxlY3RlZEVuY29kaW5nOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xyXG4gIHN0b3BTb2NrZXRTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XHJcbiAgc3RhcnRTb2NrZXRTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XHJcbiAgbW9kdWxlOiBhbnk7XHJcbiAgcmVkaXJlY3RvcjogYW55O1xyXG4gIGRhdGFQcm9jZXNzb3IhOiBJRGF0YVByb2Nlc3NvciB8IG51bGw7XHJcbiAgbW91c2VIZWxwZXIhOiBNb3VzZUhlbHBlcjtcclxuICBrZXlib2FyZEhlbHBlciE6IEtleUJvYXJkSGVscGVyO1xyXG4gIGxvZ2dlciE6IElMb2dnZXI7XHJcbiAgcG93ZXJTdGF0ZTogYW55ID0gMDtcclxuICBidG5UZXh0OiBzdHJpbmcgPSAnRGlzY29ubmVjdCc7XHJcbiAgaXNQb3dlcmVkT246IGJvb2xlYW4gPSBmYWxzZTtcclxuICBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBkZXZpY2VJZDogc3RyaW5nID0gJyc7XHJcbiAgc2VsZWN0ZWQ6IG51bWJlciA9IDE7XHJcbiAgdGltZUludGVydmFsITogYW55O1xyXG4gIHNlcnZlcjogc3RyaW5nID0gYCR7ZW52aXJvbm1lbnQubXBzU2VydmVyLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKX0vcmVsYXlgO1xyXG4gIHByZXZpb3VzQWN0aW9uID0gJ2t2bSc7XHJcbiAgc2VsZWN0ZWRBY3Rpb24gPSAnJztcclxuICBtb3VzZU1vdmU6IGFueSA9IG51bGw7XHJcblxyXG4gIGVuY29kaW5ncyA9IFtcclxuICAgIHsgdmFsdWU6IDEsIHZpZXdWYWx1ZTogJ1JMRSA4JyB9LFxyXG4gICAgeyB2YWx1ZTogMiwgdmlld1ZhbHVlOiAnUkxFIDE2JyB9LFxyXG4gIF07XHJcblxyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoJ3VzZXJJbnB1dCcpIHB1YmxpYyBwYXJhbXMpIHtcclxuICAgIHRoaXMuZGV2aWNlSWQgPSB0aGlzLnBhcmFtcy5kZXZpY2VJZDtcclxuICAgIGlmIChlbnZpcm9ubWVudC5tcHNTZXJ2ZXIuaW5jbHVkZXMoJy9tcHMnKSkge1xyXG4gICAgICAvL2hhbmRsZXMga29uZyByb3V0ZVxyXG4gICAgICB0aGlzLnNlcnZlciA9IGAke2Vudmlyb25tZW50Lm1wc1NlcnZlci5yZXBsYWNlKCdodHRwJywgJ3dzJyl9L3dzL3JlbGF5YDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5sb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcigxKTtcclxuICAgIHRoaXMuZGV2aWNlQ29ubmVjdGlvbi5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgaWYgKGRhdGEgPT09IHRydWUpIHtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnN0b3BLdm0oKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNlbGVjdGVkRW5jb2Rpbmcuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBkYXRhO1xyXG4gICAgICB0aGlzLm9uRW5jb2RpbmdDaGFuZ2UoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBpbnN0YW50aWF0ZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzPy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3IgPSBuZXcgQU1US3ZtRGF0YVJlZGlyZWN0b3IoXHJcbiAgICAgIHRoaXMubG9nZ2VyLFxyXG4gICAgICBQcm90b2NvbC5LVk0sXHJcbiAgICAgIG5ldyBGaWxlUmVhZGVyKCksXHJcbiAgICAgIHRoaXMuZGV2aWNlSWQsXHJcbiAgICAgIDE2OTk0LFxyXG4gICAgICAnJyxcclxuICAgICAgJycsXHJcbiAgICAgIDAsXHJcbiAgICAgIDAsXHJcbiAgICAgIHRoaXMucGFyYW1zLmF1dGhUb2tlbixcclxuICAgICAgdGhpcy5zZXJ2ZXJcclxuICAgICk7XHJcbiAgICB0aGlzLm1vZHVsZSA9IG5ldyBBTVREZXNrdG9wKHRoaXMubG9nZ2VyIGFzIGFueSwgdGhpcy5jb250ZXh0KTtcclxuICAgIHRoaXMuZGF0YVByb2Nlc3NvciA9IG5ldyBEYXRhUHJvY2Vzc29yKFxyXG4gICAgICB0aGlzLmxvZ2dlcixcclxuICAgICAgdGhpcy5yZWRpcmVjdG9yLFxyXG4gICAgICB0aGlzLm1vZHVsZVxyXG4gICAgKTtcclxuICAgIHRoaXMubW91c2VIZWxwZXIgPSBuZXcgTW91c2VIZWxwZXIodGhpcy5tb2R1bGUsIHRoaXMucmVkaXJlY3RvciwgMjAwKTtcclxuICAgIHRoaXMua2V5Ym9hcmRIZWxwZXIgPSBuZXcgS2V5Qm9hcmRIZWxwZXIodGhpcy5tb2R1bGUsIHRoaXMucmVkaXJlY3Rvcik7XHJcblxyXG4gICAgdGhpcy5yZWRpcmVjdG9yLm9uUHJvY2Vzc0RhdGEgPSB0aGlzLm1vZHVsZS5wcm9jZXNzRGF0YS5iaW5kKHRoaXMubW9kdWxlKTtcclxuICAgIHRoaXMucmVkaXJlY3Rvci5vblN0YXJ0ID0gdGhpcy5tb2R1bGUuc3RhcnQuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25OZXdTdGF0ZSA9IHRoaXMubW9kdWxlLm9uU3RhdGVDaGFuZ2UuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25TZW5kS3ZtRGF0YSA9IHRoaXMubW9kdWxlLm9uU2VuZEt2bURhdGEuYmluZCh0aGlzLm1vZHVsZSk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25TdGF0ZUNoYW5nZWQgPSB0aGlzLm9uQ29ubmVjdGlvblN0YXRlQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25FcnJvciA9IHRoaXMub25SZWRpcmVjdG9yRXJyb3IuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubW9kdWxlLm9uU2VuZCA9IHRoaXMucmVkaXJlY3Rvci5zZW5kLmJpbmQodGhpcy5yZWRpcmVjdG9yKTtcclxuICAgIHRoaXMubW9kdWxlLm9uUHJvY2Vzc0RhdGEgPSB0aGlzLmRhdGFQcm9jZXNzb3IucHJvY2Vzc0RhdGEuYmluZChcclxuICAgICAgdGhpcy5kYXRhUHJvY2Vzc29yXHJcbiAgICApO1xyXG4gICAgdGhpcy5tb2R1bGUuYnBwID0gdGhpcy5zZWxlY3RlZDtcclxuICAgIHRoaXMubW91c2VNb3ZlID0gZnJvbUV2ZW50KHRoaXMuY2FudmFzPy5uYXRpdmVFbGVtZW50LCAnbW91c2Vtb3ZlJyk7XHJcbiAgICB0aGlzLm1vdXNlTW92ZS5waXBlKHRocm90dGxlVGltZSgyMDApKS5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgaWYgKHRoaXMubW91c2VIZWxwZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMubW91c2VIZWxwZXIubW91c2Vtb3ZlKGV2ZW50KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZSA9IChyZWRpcmVjdG9yOiBhbnksIHN0YXRlOiBudW1iZXIpOiBhbnkgPT4ge1xyXG4gICAgdGhpcy5kZXZpY2VTdGF0ZSA9IHN0YXRlO1xyXG4gICAgdGhpcy5kZXZpY2VTdGF0dXMuZW1pdChzdGF0ZSk7XHJcbiAgfTtcclxuXHJcbiAgb25SZWRpcmVjdG9yRXJyb3IoKTogdm9pZCB7XHJcbiAgICB0aGlzLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBpbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbnN0YW50aWF0ZSgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuYXV0b0Nvbm5lY3QoKTtcclxuICAgIH0sIDQwMDApO1xyXG4gIH1cclxuXHJcbiAgYXV0b0Nvbm5lY3QoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5yZWRpcmVjdG9yICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5yZWRpcmVjdG9yLnN0YXJ0KFdlYlNvY2tldCk7XHJcbiAgICAgIHRoaXMua2V5Ym9hcmRIZWxwZXIuR3JhYktleUlucHV0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkVuY29kaW5nQ2hhbmdlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zdG9wS3ZtKCk7XHJcbiAgICB0aW1lcigxMDAwKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmF1dG9Db25uZWN0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoZWNrUG93ZXJTdGF0dXMoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5wb3dlclN0YXRlLnBvd2Vyc3RhdGUgPT09IDI7XHJcbiAgfVxyXG5cclxuICByZXNldCA9ICgpOiB2b2lkID0+IHtcclxuICAgIHRoaXMucmVkaXJlY3RvciA9IG51bGw7XHJcbiAgICB0aGlzLm1vZHVsZSA9IG51bGw7XHJcbiAgICB0aGlzLmRhdGFQcm9jZXNzb3IgPSBudWxsO1xyXG4gICAgdGhpcy5oZWlnaHQgPSA0MDA7XHJcbiAgICB0aGlzLndpZHRoID0gNDAwO1xyXG4gICAgdGhpcy5pbnN0YW50aWF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIHN0b3BLdm0gPSAoKTogdm9pZCA9PiB7XHJcbiAgICB0aGlzLnJlZGlyZWN0b3Iuc3RvcCgpO1xyXG4gICAgdGhpcy5rZXlib2FyZEhlbHBlci5VbkdyYWJLZXlJbnB1dCgpO1xyXG4gICAgdGhpcy5yZXNldCgpO1xyXG4gIH07XHJcblxyXG4gIG9uTW91c2V1cChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubW91c2VIZWxwZXIgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLm1vdXNlSGVscGVyLm1vdXNldXAoZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLm1vdXNlSGVscGVyICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5tb3VzZUhlbHBlci5tb3VzZWRvd24oZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25Nb3VzZW1vdmUoZXZlbnQ6TW91c2VFdmVudCk6dm9pZHtcclxuICAgIGlmICh0aGlzLm1vdXNlSGVscGVyICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5tb3VzZUhlbHBlci5tb3VzZW1vdmUoZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0b3BLdm0oKTtcclxuICB9XHJcbn1cclxuIiwiPGRpdj5cclxuICA8Y2FudmFzXHJcbiAgICBjbGFzcz1cImNhbnZhc1wiXHJcbiAgICAjY2FudmFzXHJcbiAgICBbd2lkdGhdPVwid2lkdGhcIlxyXG4gICAgW2hlaWdodF09XCJoZWlnaHRcIlxyXG4gICAgb25jb250ZXh0bWVudT1cInJldHVybiBmYWxzZVwiXHJcbiAgICAobW91c2V1cCk9XCJvbk1vdXNldXAoJGV2ZW50KVwiXHJcbiAgICAobW91c2Vkb3duKT1cIm9uTW91c2Vkb3duKCRldmVudClcIlxyXG4gICAgKG1vdXNlbW92ZSk9XCJvbk1vdXNlbW92ZSgkZXZlbnQpXCJcclxuICA+PC9jYW52YXM+XHJcbjwvZGl2PlxyXG4iXX0=