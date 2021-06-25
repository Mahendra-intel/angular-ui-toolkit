import { Component, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { AMTDesktop, AMTKvmDataRedirector, ConsoleLogger, DataProcessor, KeyBoardHelper, MouseHelper, Protocol, } from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { environment } from '../environments/environment';
import { fromEvent, interval, of, timer } from 'rxjs';
import { catchError, finalize, mergeMap, throttleTime } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./auth.service";
import * as i2 from "./kvm.service";
const _c0 = ["canvas"];
// import { ActivatedRoute } from '@angular/router';
export class KvmComponent {
    constructor(
    // public snackBar: MatSnackBar,
    // public dialog: MatDialog,
    authService, devicesService) {
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
                // const dialog = this.dialog.open(PowerUpAlertComponent);
                // dialog.afterClosed().subscribe((result) => {
                //   if (result) {
                //     this.isLoading = true;
                //     this.devicesService
                //       .sendPowerAction(this.deviceId, 2)
                //       .pipe()
                //       .subscribe((data) => {
                //         this.instantiate();
                //         setTimeout(() => {
                //           this.isLoading = false;
                //           this.autoConnect();
                //         }, 4000);
                //       });
                //   }
                // });
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
KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(i0.ɵɵdirectiveInject(i1.AuthService), i0.ɵɵdirectiveInject(i2.KvmService)); };
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
    }], function () { return [{ type: i1.AuthService }, { type: i2.KvmService }]; }, { canvas: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsYUFBYSxFQUNiLGFBQWEsRUFHYixjQUFjLEVBQ2QsV0FBVyxFQUNYLFFBQVEsR0FDVCxNQUFNLHlDQUF5QyxDQUFDO0FBQ2pELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUcxRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQWdCLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0FBTTlFLG9EQUFvRDtBQU9wRCxNQUFNLE9BQU8sWUFBWTtJQW1DdkI7SUFDRSxnQ0FBZ0M7SUFDaEMsNEJBQTRCO0lBQ1gsV0FBd0IsRUFDeEIsY0FBMEI7UUFEMUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsbUJBQWMsR0FBZCxjQUFjLENBQVk7UUFuQzdDLDhDQUE4QztRQUU5QixVQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ1osV0FBTSxHQUFHLEdBQUcsQ0FBQztRQUNuQixnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixpQkFBWSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBUzFFLGVBQVUsR0FBUSxDQUFDLENBQUM7UUFDcEIsWUFBTyxHQUFXLFlBQVksQ0FBQztR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LFlBQVk7a0JBQXJCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBTVREZXNrdG9wLFxuICBBTVRLdm1EYXRhUmVkaXJlY3RvcixcbiAgQ29uc29sZUxvZ2dlcixcbiAgRGF0YVByb2Nlc3NvcixcbiAgSURhdGFQcm9jZXNzb3IsXG4gIElMb2dnZXIsXG4gIEtleUJvYXJkSGVscGVyLFxuICBNb3VzZUhlbHBlcixcbiAgUHJvdG9jb2wsXG59IGZyb20gJ0BvcGVuLWFtdC1jbG91ZC10b29sa2l0L3VpLXRvb2xraXQvY29yZSc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG4vLyBpbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBLdm1TZXJ2aWNlIH0gZnJvbSAnLi9rdm0uc2VydmljZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIGludGVydmFsLCBvZiwgU3Vic2NyaXB0aW9uLCB0aW1lciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZmluYWxpemUsIG1lcmdlTWFwLCB0aHJvdHRsZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4vLyBpbXBvcnQgeyBNYXREaWFsb2cgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuLy8gaW1wb3J0IHsgTWF0U25hY2tCYXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbmFjay1iYXInO1xuLy8gaW1wb3J0IHsgUG93ZXJVcEFsZXJ0Q29tcG9uZW50IH0gZnJvbSAnLi9zaGFyZWQvcG93ZXItdXAtYWxlcnQvcG93ZXItdXAtYWxlcnQuY29tcG9uZW50Jztcbi8vIGltcG9ydCBTbmFja2JhckRlZmF1bHRzIGZyb20gJy4vc2hhcmVkL2NvbmZpZy9zbmFja0JhckRlZmF1bHQnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSdcbi8vIGltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYW10LWt2bScsXG4gIHRlbXBsYXRlVXJsOiAnLi9rdm0uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZXM6IFtdLFxufSlcbmV4cG9ydCBjbGFzcyBLdm1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBWaWV3Q2hpbGQoJ2NhbnZhcycsIHsgc3RhdGljOiBmYWxzZSB9KSBjYW52YXM6IEVsZW1lbnRSZWYgfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyBjb250ZXh0ITogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gIC8vIC8vc2V0dGluZyBhIHdpZHRoIGFuZCBoZWlnaHQgZm9yIHRoZSBjYW52YXNcblxuICBASW5wdXQoKSBwdWJsaWMgd2lkdGggPSA0MDA7XG4gIEBJbnB1dCgpIHB1YmxpYyBoZWlnaHQgPSA0MDA7XG4gIEBPdXRwdXQoKSBkZXZpY2VTdGF0ZTogbnVtYmVyID0gMDtcbiAgQE91dHB1dCgpIGRldmljZVN0YXR1czogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcbiAgc3RvcFNvY2tldFN1YnNjcmlwdGlvbiE6IFN1YnNjcmlwdGlvbjtcbiAgc3RhcnRTb2NrZXRTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XG4gIG1vZHVsZTogYW55O1xuICByZWRpcmVjdG9yOiBhbnk7XG4gIGRhdGFQcm9jZXNzb3IhOiBJRGF0YVByb2Nlc3NvciB8IG51bGw7XG4gIG1vdXNlSGVscGVyITogTW91c2VIZWxwZXI7XG4gIGtleWJvYXJkSGVscGVyITogS2V5Qm9hcmRIZWxwZXI7XG4gIGxvZ2dlciE6IElMb2dnZXI7XG4gIHBvd2VyU3RhdGU6IGFueSA9IDA7XG4gIGJ0blRleHQ6IHN0cmluZyA9ICdEaXNjb25uZWN0JztcbiAgaXNQb3dlcmVkT246IGJvb2xlYW4gPSBmYWxzZTtcbiAgaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XG4gIGRldmljZUlkOiBzdHJpbmcgPSAnJztcbiAgc2VsZWN0ZWQ6IG51bWJlciA9IDE7XG4gIHRpbWVJbnRlcnZhbCE6IGFueTtcbiAgc2VydmVyOiBzdHJpbmcgPSBgJHtlbnZpcm9ubWVudC5tcHNTZXJ2ZXIucmVwbGFjZSgnaHR0cCcsICd3cycpfS9yZWxheWA7XG4gIHByZXZpb3VzQWN0aW9uID0gJ2t2bSc7XG4gIHNlbGVjdGVkQWN0aW9uID0gJyc7XG4gIG1vdXNlTW92ZTogYW55ID0gbnVsbDtcblxuICBlbmNvZGluZ3MgPSBbXG4gICAgeyB2YWx1ZTogMSwgdmlld1ZhbHVlOiAnUkxFIDgnIH0sXG4gICAgeyB2YWx1ZTogMiwgdmlld1ZhbHVlOiAnUkxFIDE2JyB9LFxuICBdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8vIHB1YmxpYyBzbmFja0JhcjogTWF0U25hY2tCYXIsXG4gICAgLy8gcHVibGljIGRpYWxvZzogTWF0RGlhbG9nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGV2aWNlc1NlcnZpY2U6IEt2bVNlcnZpY2UsXG4gICAgLy8gcHVibGljIHJlYWRvbmx5IGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVxuICApIHtcbiAgICBpZiAoZW52aXJvbm1lbnQubXBzU2VydmVyLmluY2x1ZGVzKCcvbXBzJykpIHtcbiAgICAgIC8vaGFuZGxlcyBrb25nIHJvdXRlXG4gICAgICB0aGlzLnNlcnZlciA9IGAke2Vudmlyb25tZW50Lm1wc1NlcnZlci5yZXBsYWNlKCdodHRwJywgJ3dzJyl9L3dzL3JlbGF5YDtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBDb25zb2xlTG9nZ2VyKDEpO1xuICAgIC8vIHRoaXMuYWN0aXZhdGVkUm91dGUucGFyYW1zLnN1YnNjcmliZSgocGFyYW1zKSA9PiB7XG4gICAgLy8gICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gICAgLy8gICB0aGlzLmRldmljZUlkID0gcGFyYW1zLmlkO1xuICAgIC8vIH0pO1xuICAgIHRoaXMuc3RvcFNvY2tldFN1YnNjcmlwdGlvbiA9IHRoaXMuZGV2aWNlc1NlcnZpY2Uuc3RvcHdlYlNvY2tldC5zdWJzY3JpYmUoXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RvcEt2bSgpO1xuICAgICAgfVxuICAgICk7XG4gICAgdGhpcy5zdGFydFNvY2tldFN1YnNjcmlwdGlvbiA9XG4gICAgICB0aGlzLmRldmljZXNTZXJ2aWNlLmNvbm5lY3RLVk1Tb2NrZXQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRBbXRGZWF0dXJlcygpO1xuICAgICAgfSk7XG4gICAgdGhpcy50aW1lSW50ZXJ2YWwgPSBpbnRlcnZhbCgxNTAwMClcbiAgICAgIC5waXBlKG1lcmdlTWFwKCgpID0+IHRoaXMuZGV2aWNlc1NlcnZpY2UuZ2V0UG93ZXJTdGF0ZSh0aGlzLmRldmljZUlkKSkpXG4gICAgICAuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRBbXRGZWF0dXJlcygpO1xuICB9XG5cbiAgaW5zdGFudGlhdGUoKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXM/Lm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLnJlZGlyZWN0b3IgPSBuZXcgQU1US3ZtRGF0YVJlZGlyZWN0b3IoXG4gICAgICB0aGlzLmxvZ2dlcixcbiAgICAgIFByb3RvY29sLktWTSxcbiAgICAgIG5ldyBGaWxlUmVhZGVyKCksXG4gICAgICB0aGlzLmRldmljZUlkLFxuICAgICAgMTY5OTQsXG4gICAgICAnJyxcbiAgICAgICcnLFxuICAgICAgMCxcbiAgICAgIDAsXG4gICAgICB0aGlzLmF1dGhTZXJ2aWNlLmdldExvZ2dlZFVzZXJUb2tlbigpLFxuICAgICAgdGhpcy5zZXJ2ZXJcbiAgICApO1xuICAgIHRoaXMubW9kdWxlID0gbmV3IEFNVERlc2t0b3AodGhpcy5sb2dnZXIgYXMgYW55LCB0aGlzLmNvbnRleHQpO1xuICAgIHRoaXMuZGF0YVByb2Nlc3NvciA9IG5ldyBEYXRhUHJvY2Vzc29yKFxuICAgICAgdGhpcy5sb2dnZXIsXG4gICAgICB0aGlzLnJlZGlyZWN0b3IsXG4gICAgICB0aGlzLm1vZHVsZVxuICAgICk7XG4gICAgdGhpcy5tb3VzZUhlbHBlciA9IG5ldyBNb3VzZUhlbHBlcih0aGlzLm1vZHVsZSwgdGhpcy5yZWRpcmVjdG9yLCAyMDApO1xuICAgIHRoaXMua2V5Ym9hcmRIZWxwZXIgPSBuZXcgS2V5Qm9hcmRIZWxwZXIodGhpcy5tb2R1bGUsIHRoaXMucmVkaXJlY3Rvcik7XG5cbiAgICB0aGlzLnJlZGlyZWN0b3Iub25Qcm9jZXNzRGF0YSA9IHRoaXMubW9kdWxlLnByb2Nlc3NEYXRhLmJpbmQodGhpcy5tb2R1bGUpO1xuICAgIHRoaXMucmVkaXJlY3Rvci5vblN0YXJ0ID0gdGhpcy5tb2R1bGUuc3RhcnQuYmluZCh0aGlzLm1vZHVsZSk7XG4gICAgdGhpcy5yZWRpcmVjdG9yLm9uTmV3U3RhdGUgPSB0aGlzLm1vZHVsZS5vblN0YXRlQ2hhbmdlLmJpbmQodGhpcy5tb2R1bGUpO1xuICAgIHRoaXMucmVkaXJlY3Rvci5vblNlbmRLdm1EYXRhID0gdGhpcy5tb2R1bGUub25TZW5kS3ZtRGF0YS5iaW5kKHRoaXMubW9kdWxlKTtcbiAgICB0aGlzLnJlZGlyZWN0b3Iub25TdGF0ZUNoYW5nZWQgPSB0aGlzLm9uQ29ubmVjdGlvblN0YXRlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWRpcmVjdG9yLm9uRXJyb3IgPSB0aGlzLm9uUmVkaXJlY3RvckVycm9yLmJpbmQodGhpcyk7XG4gICAgdGhpcy5tb2R1bGUub25TZW5kID0gdGhpcy5yZWRpcmVjdG9yLnNlbmQuYmluZCh0aGlzLnJlZGlyZWN0b3IpO1xuICAgIHRoaXMubW9kdWxlLm9uUHJvY2Vzc0RhdGEgPSB0aGlzLmRhdGFQcm9jZXNzb3IucHJvY2Vzc0RhdGEuYmluZChcbiAgICAgIHRoaXMuZGF0YVByb2Nlc3NvclxuICAgICk7XG4gICAgdGhpcy5tb2R1bGUuYnBwID0gdGhpcy5zZWxlY3RlZDtcbiAgICB0aGlzLm1vdXNlTW92ZSA9IGZyb21FdmVudCh0aGlzLmNhbnZhcz8ubmF0aXZlRWxlbWVudCwgJ21vdXNlbW92ZScpO1xuICAgIHRoaXMubW91c2VNb3ZlLnBpcGUodGhyb3R0bGVUaW1lKDIwMCkpLnN1YnNjcmliZSgoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgaWYgKHRoaXMubW91c2VIZWxwZXIgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLm1vdXNlSGVscGVyLm1vdXNlbW92ZShldmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZSA9IChyZWRpcmVjdG9yOiBhbnksIHN0YXRlOiBudW1iZXIpOiBhbnkgPT4ge1xuICAgIHRoaXMuZGV2aWNlU3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLmRldmljZVN0YXR1cy5lbWl0KHN0YXRlKTtcbiAgfTtcblxuICBvblJlZGlyZWN0b3JFcnJvcigpOiB2b2lkIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBpbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZGV2aWNlc1NlcnZpY2VcbiAgICAgIC5nZXRQb3dlclN0YXRlKHRoaXMuZGV2aWNlSWQpXG4gICAgICAucGlwZShcbiAgICAgICAgY2F0Y2hFcnJvcigoKSA9PiB7XG4gICAgICAgICAgLy8gdGhpcy5zbmFja0Jhci5vcGVuKGBFcnJvciByZXRyaWV2aW5nIHBvd2VyIHN0YXR1c2AsIHVuZGVmaW5lZCwgU25hY2tiYXJEZWZhdWx0cy5kZWZhdWx0RXJyb3IpXG4gICAgICAgICAgcmV0dXJuIG9mKCk7XG4gICAgICAgIH0pLFxuICAgICAgICBmaW5hbGl6ZSgoKSA9PiB7fSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5wb3dlclN0YXRlID0gZGF0YTtcbiAgICAgICAgdGhpcy5pc1Bvd2VyZWRPbiA9IHRoaXMuY2hlY2tQb3dlclN0YXR1cygpO1xuICAgICAgICBpZiAoIXRoaXMuaXNQb3dlcmVkT24pIHtcbiAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIC8vIGNvbnN0IGRpYWxvZyA9IHRoaXMuZGlhbG9nLm9wZW4oUG93ZXJVcEFsZXJ0Q29tcG9uZW50KTtcbiAgICAgICAgICAvLyBkaWFsb2cuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIC8vICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgIC8vICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgLy8gICAgIHRoaXMuZGV2aWNlc1NlcnZpY2VcbiAgICAgICAgICAvLyAgICAgICAuc2VuZFBvd2VyQWN0aW9uKHRoaXMuZGV2aWNlSWQsIDIpXG4gICAgICAgICAgLy8gICAgICAgLnBpcGUoKVxuICAgICAgICAgIC8vICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAvLyAgICAgICAgIHRoaXMuaW5zdGFudGlhdGUoKTtcbiAgICAgICAgICAvLyAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIC8vICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIC8vICAgICAgICAgICB0aGlzLmF1dG9Db25uZWN0KCk7XG4gICAgICAgICAgLy8gICAgICAgICB9LCA0MDAwKTtcbiAgICAgICAgICAvLyAgICAgICB9KTtcbiAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAvLyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmluc3RhbnRpYXRlKCk7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5hdXRvQ29ubmVjdCgpO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHNldEFtdEZlYXR1cmVzKCk6IHZvaWQge1xuICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZygnY29taW5nIGluc2lkZSBpbiBzZXRBbXRmZWF0dXJlcycpO1xuICAgIHRoaXMuZGV2aWNlc1NlcnZpY2VcbiAgICAgIC5zZXRBbXRGZWF0dXJlcyh0aGlzLmRldmljZUlkKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xuICAgICAgICAgIC8vIHRoaXMuc25hY2tCYXIub3BlbihgRXJyb3IgZW5hYmxpbmcga3ZtYCwgdW5kZWZpbmVkLCBTbmFja2JhckRlZmF1bHRzLmRlZmF1bHRFcnJvcilcbiAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICByZXR1cm4gb2YoKTtcbiAgICAgICAgfSksXG4gICAgICAgIGZpbmFsaXplKCgpID0+IHt9KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLmluaXQoKSk7XG4gIH1cblxuICBhdXRvQ29ubmVjdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZWRpcmVjdG9yICE9IG51bGwpIHtcbiAgICAgIHRoaXMucmVkaXJlY3Rvci5zdGFydChXZWJTb2NrZXQpO1xuICAgICAgdGhpcy5rZXlib2FyZEhlbHBlci5HcmFiS2V5SW5wdXQoKTtcbiAgICB9XG4gIH1cblxuICBcbiAgb25FbmNvZGluZ0NoYW5nZSAoKTogdm9pZCB7XG4gICAgdGhpcy5zdG9wS3ZtKClcbiAgICB0aW1lcigxMDAwKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5hdXRvQ29ubmVjdCgpXG4gICAgfSlcbiAgfVxuXG4gIGNoZWNrUG93ZXJTdGF0dXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucG93ZXJTdGF0ZS5wb3dlcnN0YXRlID09PSAyO1xuICB9XG5cbiAgcmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5yZWRpcmVjdG9yID0gbnVsbDtcbiAgICB0aGlzLm1vZHVsZSA9IG51bGw7XG4gICAgdGhpcy5kYXRhUHJvY2Vzc29yID0gbnVsbDtcbiAgICB0aGlzLmhlaWdodCA9IDQwMDtcbiAgICB0aGlzLndpZHRoID0gNDAwO1xuICAgIHRoaXMuaW5zdGFudGlhdGUoKTtcbiAgfTtcblxuICBzdG9wS3ZtID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMucmVkaXJlY3Rvci5zdG9wKCk7XG4gICAgdGhpcy5rZXlib2FyZEhlbHBlci5VbkdyYWJLZXlJbnB1dCgpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfTtcblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRBY3Rpb24gIT09IHRoaXMucHJldmlvdXNBY3Rpb24pIHtcbiAgICAgIHRoaXMucHJldmlvdXNBY3Rpb24gPSB0aGlzLnNlbGVjdGVkQWN0aW9uO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2V1cChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1vdXNlSGVscGVyICE9IG51bGwpIHtcbiAgICAgIHRoaXMubW91c2VIZWxwZXIubW91c2V1cChldmVudCk7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tb3VzZUhlbHBlciAhPSBudWxsKSB7XG4gICAgICB0aGlzLm1vdXNlSGVscGVyLm1vdXNlZG93bihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3kgKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRpbWVJbnRlcnZhbCkge1xuICAgICAgdGhpcy50aW1lSW50ZXJ2YWwudW5zdWJzY3JpYmUoKVxuICAgIH1cbiAgICB0aGlzLnN0b3BLdm0oKVxuICAgIGlmICh0aGlzLnN0YXJ0U29ja2V0U3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN0YXJ0U29ja2V0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKClcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RvcFNvY2tldFN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdG9wU29ja2V0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKClcbiAgICB9XG4gIH1cbn1cbiIsIjwhLS0gPGFtdC1kZXZpY2UtdG9vbGJhcj48L2FtdC1kZXZpY2UtdG9vbGJhcj4gLS0+XHJcbjxkaXY+XHJcbiAgICA8YnV0dG9uIHN0eWxlPVwiZGlzcGxheTogYmxvY2s7XCI+IGNvbm5lY3QgPC9idXR0b24+XHJcbiAgICA8Y2FudmFzIGNsYXNzPVwiY2FudmFzXCIgI2NhbnZhcyBbd2lkdGhdPVwid2lkdGhcIiBbaGVpZ2h0XT1cImhlaWdodFwiIG9uY29udGV4dG1lbnU9XCJyZXR1cm4gZmFsc2VcIiAobW91c2V1cCk9XCJvbk1vdXNldXAoJGV2ZW50KVwiIChtb3VzZWRvd24pPVwib25Nb3VzZWRvd24oJGV2ZW50KVwiPjwvY2FudmFzPlxyXG48L2Rpdj5cclxuXHJcbiJdfQ==