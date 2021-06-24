import { EventEmitter, ɵɵinject, ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, ɵɵdirectiveInject, ɵɵdefineComponent, ɵɵviewQuery, ɵɵqueryRefresh, ɵɵloadQuery, ɵɵelementStart, ɵɵtext, ɵɵelementEnd, ɵɵlistener, ɵɵadvance, ɵɵproperty, Component, ViewChild, Input, Output, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { catchError, mergeMap, throttleTime, finalize } from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConsoleLogger, AMTKvmDataRedirector, Protocol, AMTDesktop, DataProcessor, MouseHelper, KeyBoardHelper } from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { interval, fromEvent, of } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';

const environment = {
    production: false,
    mpsServer: 'https://localhost/mps',
    rpsServer: 'https://localhost/rps'
};

class KvmService {
    constructor(http) {
        this.http = http;
        this.connectKVMSocket = new EventEmitter(false);
        this.stopwebSocket = new EventEmitter(false);
    }
    setAmtFeatures(deviceId) {
        const payload = { userConsent: 'none', enableKVM: true, enableSOL: true, enableIDER: true };
        return this.http.post(`${environment.mpsServer}/api/v1/amt/features/${deviceId}`, payload)
            .pipe(catchError((err) => {
            throw err;
        }));
    }
    getPowerState(deviceId) {
        return this.http.get(`${environment.mpsServer}/api/v1/amt/power/state/${deviceId}`)
            .pipe(catchError((err) => {
            throw err;
        }));
    }
}
KvmService.ɵfac = function KvmService_Factory(t) { return new (t || KvmService)(ɵɵinject(HttpClient)); };
KvmService.ɵprov = ɵɵdefineInjectable({ token: KvmService, factory: KvmService.ɵfac, providedIn: 'platform' });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(KvmService, [{
        type: Injectable,
        args: [{
                providedIn: 'platform'
            }]
    }], function () { return [{ type: HttpClient }]; }, null); })();

const _c0 = ["canvas"];
// import { AuthService } from './auth.service'
class KvmComponent {
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
KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(ɵɵdirectiveInject(KvmService)); };
KvmComponent.ɵcmp = ɵɵdefineComponent({ type: KvmComponent, selectors: [["amt-kvm"]], viewQuery: function KvmComponent_Query(rf, ctx) { if (rf & 1) {
        ɵɵviewQuery(_c0, 1);
    } if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.canvas = _t.first);
    } }, inputs: { width: "width", height: "height" }, outputs: { deviceState: "deviceState", deviceStatus: "deviceStatus" }, decls: 5, vars: 2, consts: [[2, "display", "block"], ["oncontextmenu", "return false", 1, "canvas", 3, "width", "height", "mouseup", "mousedown"], ["canvas", ""]], template: function KvmComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "div");
        ɵɵelementStart(1, "button", 0);
        ɵɵtext(2, " connect ");
        ɵɵelementEnd();
        ɵɵelementStart(3, "canvas", 1, 2);
        ɵɵlistener("mouseup", function KvmComponent_Template_canvas_mouseup_3_listener($event) { return ctx.onMouseup($event); })("mousedown", function KvmComponent_Template_canvas_mousedown_3_listener($event) { return ctx.onMousedown($event); });
        ɵɵelementEnd();
        ɵɵelementEnd();
    } if (rf & 2) {
        ɵɵadvance(3);
        ɵɵproperty("width", ctx.width)("height", ctx.height);
    } }, encapsulation: 2 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(KvmComponent, [{
        type: Component,
        args: [{
                selector: 'amt-kvm',
                templateUrl: './kvm.component.html',
                styles: [],
            }]
    }], function () { return [{ type: KvmService }]; }, { canvas: [{
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

class DeviceToolbarComponent {
    constructor() { }
    ngOnInit() {
    }
}
DeviceToolbarComponent.ɵfac = function DeviceToolbarComponent_Factory(t) { return new (t || DeviceToolbarComponent)(); };
DeviceToolbarComponent.ɵcmp = ɵɵdefineComponent({ type: DeviceToolbarComponent, selectors: [["amt-device-toolbar"]], decls: 6, vars: 0, template: function DeviceToolbarComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "div");
        ɵɵtext(1, "Device Control");
        ɵɵelementEnd();
        ɵɵelementStart(2, "div");
        ɵɵtext(3, "List");
        ɵɵelementEnd();
        ɵɵelementStart(4, "button");
        ɵɵtext(5, "tv");
        ɵɵelementEnd();
    } }, styles: [""] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(DeviceToolbarComponent, [{
        type: Component,
        args: [{
                selector: 'amt-device-toolbar',
                templateUrl: './device-toolbar.component.html',
                styleUrls: ['./device-toolbar.component.css']
            }]
    }], function () { return []; }, null); })();

class KvmModule {
}
KvmModule.ɵfac = function KvmModule_Factory(t) { return new (t || KvmModule)(); };
KvmModule.ɵmod = ɵɵdefineNgModule({ type: KvmModule });
KvmModule.ɵinj = ɵɵdefineInjector({ providers: [], imports: [[HttpClientModule, BrowserModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(KvmModule, { declarations: [KvmComponent, DeviceToolbarComponent], imports: [HttpClientModule, BrowserModule], exports: [KvmComponent] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(KvmModule, [{
        type: NgModule,
        args: [{
                declarations: [KvmComponent, DeviceToolbarComponent],
                imports: [HttpClientModule, BrowserModule],
                exports: [KvmComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [],
            }]
    }], null, null); })();

/*
 * Public API Surface of kvm
 */

/**
 * Generated bundle index. Do not edit.
 */

export { KvmComponent, KvmModule, KvmService };
//# sourceMappingURL=kvm.js.map
