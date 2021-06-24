import { Component, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { AMTDesktop, AMTKvmDataRedirector, ConsoleLogger, DataProcessor, KeyBoardHelper, MouseHelper, Protocol, } from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { environment } from '../environments/environment';
import { fromEvent, interval, of } from 'rxjs';
import { catchError, finalize, mergeMap, throttleTime } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./kvm.service";
const _c0 = ["canvas"];
// import { AuthService } from './auth.service'
export class KvmComponent {
    constructor(devicesService) {
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
        this.redirector = new AMTKvmDataRedirector(this.logger, Protocol.KVM, new FileReader(), this.deviceId, 16994, '', '', 0, 0, 
        // this.authService.getLoggedUserToken(),
        this.server);
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
            // this.snackBar.open($localize`Error retrieving power status`, undefined, SnackbarDefaults.defaultError)
            return of();
        }), finalize(() => { }))
            .subscribe((data) => {
            this.powerState = data;
            this.isPoweredOn = this.checkPowerStatus();
            if (!this.isPoweredOn) {
                this.isLoading = false;
                // const dialog = this.dialog.open(PowerUpAlertComponent)
                // dialog.afterClosed().subscribe(result => {
                //   if (result) {
                //     this.isLoading = true
                //     this.devicesService.sendPowerAction(this.deviceId, 2).pipe().subscribe(data => {
                //       this.instantiate()
                //       setTimeout(() => {
                //         this.isLoading = false
                //         this.autoConnect()
                //       }, 4000)
                //     })
                //   }
                // })
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
            // this.snackBar.open($localize`Error enabling kvm`, undefined, SnackbarDefaults.defaultError)
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
}
KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(i0.ɵɵdirectiveInject(i1.KvmService)); };
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
    }], function () { return [{ type: i1.KvmService }]; }, { canvas: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsYUFBYSxFQUNiLGFBQWEsRUFHYixjQUFjLEVBQ2QsV0FBVyxFQUNYLFFBQVEsR0FDVCxNQUFNLHlDQUF5QyxDQUFDO0FBQ2pELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUcxRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQXVCLE1BQU0sTUFBTSxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUM5RSwrQ0FBK0M7QUFPL0MsTUFBTSxPQUFPLFlBQVk7SUFtQ3ZCLFlBQ21CLGNBQTBCO1FBQTFCLG1CQUFjLEdBQWQsY0FBYyxDQUFZO1FBaEM3Qyw4Q0FBOEM7UUFFOUIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUNaLFdBQU0sR0FBRyxHQUFHLENBQUM7UUFDbkIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsaUJBQVksR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQVMxRSxlQUFVLEdBQVEsQ0FBQyxDQUFDO1FBQ3BCLFlBQU8sR0FBVyxZQUFZLENBQUM7UUFDL0IsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFDN0IsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixhQUFRLEdBQVcsRUFBRSxD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LElBQUMsMEZBQWMsdUJBQW1CLElBQWpDO1FBQW1DLGlCQUFTO1FBQzNLLGlCQUFNOztRQUQ2QixlQUFlO1FBQWYsaUNBQWUsc0JBQUE7O3VGRCtCckMsWUFBWTtjQUx4QixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLFdBQVcsRUFBRSxzQkFBc0I7Z0JBQ25DLE1BQU0sRUFBRSxFQUFFO2FBQ1g7NkRBRXlDLE1BQU07a0JBQTdDLFNBQVM7bUJBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUt0QixLQUFLO2tCQUFwQixLQUFLO1lBQ1UsTUFBTTtrQkFBckIsS0FBSztZQUNJLFdBQVc7a0JBQXBCLE1BQU07WUFDRyxZQUFZO2tCQUFyQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQU1URGVza3RvcCxcbiAgQU1US3ZtRGF0YVJlZGlyZWN0b3IsXG4gIENvbnNvbGVMb2dnZXIsXG4gIERhdGFQcm9jZXNzb3IsXG4gIElEYXRhUHJvY2Vzc29yLFxuICBJTG9nZ2VyLFxuICBLZXlCb2FyZEhlbHBlcixcbiAgTW91c2VIZWxwZXIsXG4gIFByb3RvY29sLFxufSBmcm9tICdAb3Blbi1hbXQtY2xvdWQtdG9vbGtpdC91aS10b29sa2l0L2NvcmUnO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuLy8gaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgS3ZtU2VydmljZSB9IGZyb20gJy4va3ZtLnNlcnZpY2UnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBpbnRlcnZhbCwgb2YsIFN1YnNjcmlwdGlvbiwgdGltZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGZpbmFsaXplLCBtZXJnZU1hcCwgdGhyb3R0bGVUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuLy8gaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYW10LWt2bScsXG4gIHRlbXBsYXRlVXJsOiAnLi9rdm0uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZXM6IFtdLFxufSlcbmV4cG9ydCBjbGFzcyBLdm1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICBAVmlld0NoaWxkKCdjYW52YXMnLCB7IHN0YXRpYzogZmFsc2UgfSkgY2FudmFzOiBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgY29udGV4dCE6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAvLyAvL3NldHRpbmcgYSB3aWR0aCBhbmQgaGVpZ2h0IGZvciB0aGUgY2FudmFzXG5cbiAgQElucHV0KCkgcHVibGljIHdpZHRoID0gNDAwO1xuICBASW5wdXQoKSBwdWJsaWMgaGVpZ2h0ID0gNDAwO1xuICBAT3V0cHV0KCkgZGV2aWNlU3RhdGU6IG51bWJlciA9IDA7XG4gIEBPdXRwdXQoKSBkZXZpY2VTdGF0dXM6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG4gIHN0b3BTb2NrZXRTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XG4gIHN0YXJ0U29ja2V0U3Vic2NyaXB0aW9uITogU3Vic2NyaXB0aW9uO1xuICBtb2R1bGU6IGFueTtcbiAgcmVkaXJlY3RvcjogYW55O1xuICBkYXRhUHJvY2Vzc29yITogSURhdGFQcm9jZXNzb3IgfCBudWxsO1xuICBtb3VzZUhlbHBlciE6IE1vdXNlSGVscGVyO1xuICBrZXlib2FyZEhlbHBlciE6IEtleUJvYXJkSGVscGVyO1xuICBsb2dnZXIhOiBJTG9nZ2VyO1xuICBwb3dlclN0YXRlOiBhbnkgPSAwO1xuICBidG5UZXh0OiBzdHJpbmcgPSAnRGlzY29ubmVjdCc7XG4gIGlzUG93ZXJlZE9uOiBib29sZWFuID0gZmFsc2U7XG4gIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBkZXZpY2VJZDogc3RyaW5nID0gJyc7XG4gIHNlbGVjdGVkOiBudW1iZXIgPSAxO1xuICB0aW1lSW50ZXJ2YWwhOiBhbnk7XG4gIHNlcnZlcjogc3RyaW5nID0gYCR7ZW52aXJvbm1lbnQubXBzU2VydmVyLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKX0vcmVsYXlgO1xuICBwcmV2aW91c0FjdGlvbiA9ICdrdm0nO1xuICBzZWxlY3RlZEFjdGlvbiA9ICcnO1xuICBtb3VzZU1vdmU6IGFueSA9IG51bGw7XG5cbiAgZW5jb2RpbmdzID0gW1xuICAgIHsgdmFsdWU6IDEsIHZpZXdWYWx1ZTogJ1JMRSA4JyB9LFxuICAgIHsgdmFsdWU6IDIsIHZpZXdWYWx1ZTogJ1JMRSAxNicgfSxcbiAgXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRldmljZXNTZXJ2aWNlOiBLdm1TZXJ2aWNlLFxuICAgIC8vIHB1YmxpYyByZWFkb25seSBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGVcbiAgKSB7XG4gICAgaWYgKGVudmlyb25tZW50Lm1wc1NlcnZlci5pbmNsdWRlcygnL21wcycpKSB7XG4gICAgICAvL2hhbmRsZXMga29uZyByb3V0ZVxuICAgICAgdGhpcy5zZXJ2ZXIgPSBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXIucmVwbGFjZSgnaHR0cCcsICd3cycpfS93cy9yZWxheWA7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5sb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcigxKTtcbiAgICAvLyB0aGlzLmFjdGl2YXRlZFJvdXRlLnBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xuICAgIC8vICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICAgIC8vICAgdGhpcy5kZXZpY2VJZCA9IHBhcmFtcy5pZDtcbiAgICAvLyB9KTtcbiAgICB0aGlzLnN0b3BTb2NrZXRTdWJzY3JpcHRpb24gPSB0aGlzLmRldmljZXNTZXJ2aWNlLnN0b3B3ZWJTb2NrZXQuc3Vic2NyaWJlKFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnN0b3BLdm0oKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHRoaXMuc3RhcnRTb2NrZXRTdWJzY3JpcHRpb24gPVxuICAgICAgdGhpcy5kZXZpY2VzU2VydmljZS5jb25uZWN0S1ZNU29ja2V0LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0QW10RmVhdHVyZXMoKTtcbiAgICAgIH0pO1xuICAgIHRoaXMudGltZUludGVydmFsID0gaW50ZXJ2YWwoMTUwMDApXG4gICAgICAucGlwZShtZXJnZU1hcCgoKSA9PiB0aGlzLmRldmljZXNTZXJ2aWNlLmdldFBvd2VyU3RhdGUodGhpcy5kZXZpY2VJZCkpKVxuICAgICAgLnN1YnNjcmliZSgpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc2V0QW10RmVhdHVyZXMoKTtcbiAgfVxuXG4gIGluc3RhbnRpYXRlKCk6IHZvaWQge1xuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzPy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5yZWRpcmVjdG9yID0gbmV3IEFNVEt2bURhdGFSZWRpcmVjdG9yKFxuICAgICAgdGhpcy5sb2dnZXIsXG4gICAgICBQcm90b2NvbC5LVk0sXG4gICAgICBuZXcgRmlsZVJlYWRlcigpLFxuICAgICAgdGhpcy5kZXZpY2VJZCxcbiAgICAgIDE2OTk0LFxuICAgICAgJycsXG4gICAgICAnJyxcbiAgICAgIDAsXG4gICAgICAwLFxuICAgICAgLy8gdGhpcy5hdXRoU2VydmljZS5nZXRMb2dnZWRVc2VyVG9rZW4oKSxcbiAgICAgIHRoaXMuc2VydmVyXG4gICAgKTtcbiAgICB0aGlzLm1vZHVsZSA9IG5ldyBBTVREZXNrdG9wKHRoaXMubG9nZ2VyIGFzIGFueSwgdGhpcy5jb250ZXh0KTtcbiAgICB0aGlzLmRhdGFQcm9jZXNzb3IgPSBuZXcgRGF0YVByb2Nlc3NvcihcbiAgICAgIHRoaXMubG9nZ2VyLFxuICAgICAgdGhpcy5yZWRpcmVjdG9yLFxuICAgICAgdGhpcy5tb2R1bGVcbiAgICApO1xuICAgIHRoaXMubW91c2VIZWxwZXIgPSBuZXcgTW91c2VIZWxwZXIodGhpcy5tb2R1bGUsIHRoaXMucmVkaXJlY3RvciwgMjAwKTtcbiAgICB0aGlzLmtleWJvYXJkSGVscGVyID0gbmV3IEtleUJvYXJkSGVscGVyKHRoaXMubW9kdWxlLCB0aGlzLnJlZGlyZWN0b3IpO1xuXG4gICAgdGhpcy5yZWRpcmVjdG9yLm9uUHJvY2Vzc0RhdGEgPSB0aGlzLm1vZHVsZS5wcm9jZXNzRGF0YS5iaW5kKHRoaXMubW9kdWxlKTtcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25TdGFydCA9IHRoaXMubW9kdWxlLnN0YXJ0LmJpbmQodGhpcy5tb2R1bGUpO1xuICAgIHRoaXMucmVkaXJlY3Rvci5vbk5ld1N0YXRlID0gdGhpcy5tb2R1bGUub25TdGF0ZUNoYW5nZS5iaW5kKHRoaXMubW9kdWxlKTtcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25TZW5kS3ZtRGF0YSA9IHRoaXMubW9kdWxlLm9uU2VuZEt2bURhdGEuYmluZCh0aGlzLm1vZHVsZSk7XG4gICAgdGhpcy5yZWRpcmVjdG9yLm9uU3RhdGVDaGFuZ2VkID0gdGhpcy5vbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVkaXJlY3Rvci5vbkVycm9yID0gdGhpcy5vblJlZGlyZWN0b3JFcnJvci5iaW5kKHRoaXMpO1xuICAgIHRoaXMubW9kdWxlLm9uU2VuZCA9IHRoaXMucmVkaXJlY3Rvci5zZW5kLmJpbmQodGhpcy5yZWRpcmVjdG9yKTtcbiAgICB0aGlzLm1vZHVsZS5vblByb2Nlc3NEYXRhID0gdGhpcy5kYXRhUHJvY2Vzc29yLnByb2Nlc3NEYXRhLmJpbmQoXG4gICAgICB0aGlzLmRhdGFQcm9jZXNzb3JcbiAgICApO1xuICAgIHRoaXMubW9kdWxlLmJwcCA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgdGhpcy5tb3VzZU1vdmUgPSBmcm9tRXZlbnQodGhpcy5jYW52YXM/Lm5hdGl2ZUVsZW1lbnQsICdtb3VzZW1vdmUnKTtcbiAgICB0aGlzLm1vdXNlTW92ZS5waXBlKHRocm90dGxlVGltZSgyMDApKS5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIGlmICh0aGlzLm1vdXNlSGVscGVyICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5tb3VzZUhlbHBlci5tb3VzZW1vdmUoZXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25Db25uZWN0aW9uU3RhdGVDaGFuZ2UgPSAocmVkaXJlY3RvcjogYW55LCBzdGF0ZTogbnVtYmVyKTogYW55ID0+IHtcbiAgICB0aGlzLmRldmljZVN0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5kZXZpY2VTdGF0dXMuZW1pdChzdGF0ZSk7XG4gIH07XG5cbiAgb25SZWRpcmVjdG9yRXJyb3IoKTogdm9pZCB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgaW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRldmljZXNTZXJ2aWNlXG4gICAgICAuZ2V0UG93ZXJTdGF0ZSh0aGlzLmRldmljZUlkKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xuICAgICAgICAgIC8vIHRoaXMuc25hY2tCYXIub3BlbigkbG9jYWxpemVgRXJyb3IgcmV0cmlldmluZyBwb3dlciBzdGF0dXNgLCB1bmRlZmluZWQsIFNuYWNrYmFyRGVmYXVsdHMuZGVmYXVsdEVycm9yKVxuICAgICAgICAgIHJldHVybiBvZigpO1xuICAgICAgICB9KSxcbiAgICAgICAgZmluYWxpemUoKCkgPT4ge30pXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMucG93ZXJTdGF0ZSA9IGRhdGE7XG4gICAgICAgIHRoaXMuaXNQb3dlcmVkT24gPSB0aGlzLmNoZWNrUG93ZXJTdGF0dXMoKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzUG93ZXJlZE9uKSB7XG4gICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAvLyBjb25zdCBkaWFsb2cgPSB0aGlzLmRpYWxvZy5vcGVuKFBvd2VyVXBBbGVydENvbXBvbmVudClcbiAgICAgICAgICAvLyBkaWFsb2cuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgICAgICAvLyAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAvLyAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlXG4gICAgICAgICAgLy8gICAgIHRoaXMuZGV2aWNlc1NlcnZpY2Uuc2VuZFBvd2VyQWN0aW9uKHRoaXMuZGV2aWNlSWQsIDIpLnBpcGUoKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgLy8gICAgICAgdGhpcy5pbnN0YW50aWF0ZSgpXG4gICAgICAgICAgLy8gICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgLy8gICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgICAgICAgLy8gICAgICAgICB0aGlzLmF1dG9Db25uZWN0KClcbiAgICAgICAgICAvLyAgICAgICB9LCA0MDAwKVxuICAgICAgICAgIC8vICAgICB9KVxuICAgICAgICAgIC8vICAgfVxuICAgICAgICAgIC8vIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5pbnN0YW50aWF0ZSgpO1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYXV0b0Nvbm5lY3QoKVxuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHNldEFtdEZlYXR1cmVzKCk6IHZvaWQge1xuICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZygnY29taW5nIGluc2lkZSBpbiBzZXRBbXRmZWF0dXJlcycpO1xuICAgIHRoaXMuZGV2aWNlc1NlcnZpY2VcbiAgICAgIC5zZXRBbXRGZWF0dXJlcyh0aGlzLmRldmljZUlkKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xuICAgICAgICAgIC8vIHRoaXMuc25hY2tCYXIub3BlbigkbG9jYWxpemVgRXJyb3IgZW5hYmxpbmcga3ZtYCwgdW5kZWZpbmVkLCBTbmFja2JhckRlZmF1bHRzLmRlZmF1bHRFcnJvcilcbiAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICByZXR1cm4gb2YoKTtcbiAgICAgICAgfSksXG4gICAgICAgIGZpbmFsaXplKCgpID0+IHt9KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLmluaXQoKSk7XG4gIH1cblxuICBhdXRvQ29ubmVjdCAoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucmVkaXJlY3RvciAhPSBudWxsKSB7XG4gICAgICB0aGlzLnJlZGlyZWN0b3Iuc3RhcnQoV2ViU29ja2V0KVxuICAgICAgdGhpcy5rZXlib2FyZEhlbHBlci5HcmFiS2V5SW5wdXQoKVxuICAgIH1cbiAgfVxuXG4gIGNoZWNrUG93ZXJTdGF0dXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucG93ZXJTdGF0ZS5wb3dlcnN0YXRlID09PSAyO1xuICB9XG5cbiAgcmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5yZWRpcmVjdG9yID0gbnVsbDtcbiAgICB0aGlzLm1vZHVsZSA9IG51bGw7XG4gICAgdGhpcy5kYXRhUHJvY2Vzc29yID0gbnVsbDtcbiAgICB0aGlzLmhlaWdodCA9IDQwMDtcbiAgICB0aGlzLndpZHRoID0gNDAwO1xuICAgIHRoaXMuaW5zdGFudGlhdGUoKTtcbiAgfTtcblxuICBzdG9wS3ZtID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMucmVkaXJlY3Rvci5zdG9wKCk7XG4gICAgdGhpcy5rZXlib2FyZEhlbHBlci5VbkdyYWJLZXlJbnB1dCgpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfTtcblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRBY3Rpb24gIT09IHRoaXMucHJldmlvdXNBY3Rpb24pIHtcbiAgICAgIHRoaXMucHJldmlvdXNBY3Rpb24gPSB0aGlzLnNlbGVjdGVkQWN0aW9uO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2V1cChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1vdXNlSGVscGVyICE9IG51bGwpIHtcbiAgICAgIHRoaXMubW91c2VIZWxwZXIubW91c2V1cChldmVudCk7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tb3VzZUhlbHBlciAhPSBudWxsKSB7XG4gICAgICB0aGlzLm1vdXNlSGVscGVyLm1vdXNlZG93bihldmVudCk7XG4gICAgfVxuICB9XG59XG4iLCI8IS0tIDxhbXQtZGV2aWNlLXRvb2xiYXI+PC9hbXQtZGV2aWNlLXRvb2xiYXI+IC0tPlxyXG48ZGl2PlxyXG4gICAgPGJ1dHRvbiBzdHlsZT1cImRpc3BsYXk6IGJsb2NrO1wiPiBjb25uZWN0IDwvYnV0dG9uPlxyXG4gICAgPGNhbnZhcyBjbGFzcz1cImNhbnZhc1wiICNjYW52YXMgW3dpZHRoXT1cIndpZHRoXCIgW2hlaWdodF09XCJoZWlnaHRcIiBvbmNvbnRleHRtZW51PVwicmV0dXJuIGZhbHNlXCIgKG1vdXNldXApPVwib25Nb3VzZXVwKCRldmVudClcIiAobW91c2Vkb3duKT1cIm9uTW91c2Vkb3duKCRldmVudClcIj48L2NhbnZhcz5cclxuPC9kaXY+XHJcblxyXG4iXX0=