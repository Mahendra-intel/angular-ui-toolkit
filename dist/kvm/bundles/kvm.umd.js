(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/operators'), require('@angular/common/http'), require('@open-amt-cloud-toolkit/ui-toolkit/core'), require('rxjs'), require('@angular/platform-browser')) :
    typeof define === 'function' && define.amd ? define('kvm', ['exports', '@angular/core', 'rxjs/operators', '@angular/common/http', '@open-amt-cloud-toolkit/ui-toolkit/core', 'rxjs', '@angular/platform-browser'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.kvm = {}, global.ng.core, global.rxjs.operators, global.ng.common.http, global['@open-amt-cloud-toolkit']['ui-toolkit'].core, global.rxjs, global.ng.platformBrowser));
}(this, (function (exports, i0, operators, i1, core, rxjs, platformBrowser) { 'use strict';

    var environment = {
        production: false,
        mpsServer: 'https://localhost/mps',
        rpsServer: 'https://localhost/rps'
    };

    var KvmService = /** @class */ (function () {
        function KvmService(http) {
            this.http = http;
            this.connectKVMSocket = new i0.EventEmitter(false);
            this.stopwebSocket = new i0.EventEmitter(false);
        }
        KvmService.prototype.setAmtFeatures = function (deviceId) {
            var payload = {
                userConsent: 'none',
                enableKVM: true,
                enableSOL: true,
                enableIDER: true,
            };
            return this.http
                .post(environment.mpsServer + "/api/v1/amt/features/" + deviceId, payload)
                .pipe(operators.catchError(function (err) {
                throw err;
            }));
        };
        KvmService.prototype.getPowerState = function (deviceId) {
            return this.http
                .get(environment.mpsServer + "/api/v1/amt/power/state/" + deviceId)
                .pipe(operators.catchError(function (err) {
                throw err;
            }));
        };
        KvmService.prototype.sendPowerAction = function (deviceId, action, useSOL) {
            if (useSOL === void 0) { useSOL = false; }
            var payload = {
                method: 'PowerAction',
                action: action,
                useSOL: useSOL,
            };
            return this.http
                .post(environment.mpsServer + "/api/v1/amt/power/action/" + deviceId, payload)
                .pipe(operators.catchError(function (err) {
                throw err;
            }));
        };
        return KvmService;
    }());
    KvmService.ɵfac = function KvmService_Factory(t) { return new (t || KvmService)(i0.ɵɵinject(i1.HttpClient)); };
    KvmService.ɵprov = i0.ɵɵdefineInjectable({ token: KvmService, factory: KvmService.ɵfac, providedIn: 'platform' });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'platform',
                    }]
            }], function () { return [{ type: i1.HttpClient }]; }, null);
    })();

    var AuthService = /** @class */ (function () {
        function AuthService(http) {
            this.http = http;
            this.loggedInSubject = new i0.EventEmitter(false);
            this.isLoggedIn = false;
            this.url = environment.mpsServer + "/api/v1/authorize";
            if (localStorage.loggedInUser != null) {
                this.isLoggedIn = true;
                this.loggedInSubject.next(this.isLoggedIn);
            }
            if (environment.mpsServer.includes('/mps')) {
                // handles kong route
                this.url = environment.mpsServer + "/login/api/v1/authorize";
            }
        }
        AuthService.prototype.getLoggedUserToken = function () {
            var loggedUser = localStorage.getItem('loggedInUser');
            var token = JSON.parse(loggedUser).token;
            return token;
        };
        return AuthService;
    }());
    AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(i0.ɵɵinject(i1.HttpClient)); };
    AuthService.ɵprov = i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'platform' });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'platform',
                    }]
            }], function () { return [{ type: i1.HttpClient }]; }, null);
    })();

    var _c0 = ["canvas"];
    // import { ActivatedRoute } from '@angular/router';
    var KvmComponent = /** @class */ (function () {
        function KvmComponent(
        // public snackBar: MatSnackBar,
        // public dialog: MatDialog,
        authService, devicesService) {
            var _this = this;
            this.authService = authService;
            this.devicesService = devicesService;
            // //setting a width and height for the canvas
            this.width = 400;
            this.height = 400;
            this.deviceState = 0;
            this.deviceStatus = new i0.EventEmitter();
            this.powerState = 0;
            this.btnText = 'Disconnect';
            this.isPoweredOn = false;
            this.isLoading = false;
            this.deviceId = '';
            this.selected = 1;
            this.server = environment.mpsServer.replace('http', 'ws') + "/relay";
            this.previousAction = 'kvm';
            this.selectedAction = '';
            this.mouseMove = null;
            this.encodings = [
                { value: 1, viewValue: 'RLE 8' },
                { value: 2, viewValue: 'RLE 16' },
            ];
            this.onConnectionStateChange = function (redirector, state) {
                _this.deviceState = state;
                _this.deviceStatus.emit(state);
            };
            this.reset = function () {
                _this.redirector = null;
                _this.module = null;
                _this.dataProcessor = null;
                _this.height = 400;
                _this.width = 400;
                _this.instantiate();
            };
            this.stopKvm = function () {
                _this.redirector.stop();
                _this.keyboardHelper.UnGrabKeyInput();
                _this.reset();
            };
            if (environment.mpsServer.includes('/mps')) {
                //handles kong route
                this.server = environment.mpsServer.replace('http', 'ws') + "/ws/relay";
            }
        }
        KvmComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.logger = new core.ConsoleLogger(1);
            // this.activatedRoute.params.subscribe((params) => {
            //   this.isLoading = true;
            //   this.deviceId = params.id;
            // });
            this.stopSocketSubscription = this.devicesService.stopwebSocket.subscribe(function () {
                _this.stopKvm();
            });
            this.startSocketSubscription =
                this.devicesService.connectKVMSocket.subscribe(function () {
                    _this.setAmtFeatures();
                });
            this.timeInterval = rxjs.interval(15000)
                .pipe(operators.mergeMap(function () { return _this.devicesService.getPowerState(_this.deviceId); }))
                .subscribe();
        };
        KvmComponent.prototype.ngAfterViewInit = function () {
            this.setAmtFeatures();
        };
        KvmComponent.prototype.instantiate = function () {
            var _this = this;
            var _a, _b;
            this.context = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.nativeElement.getContext('2d');
            this.redirector = new core.AMTKvmDataRedirector(this.logger, core.Protocol.KVM, new FileReader(), this.deviceId, 16994, '', '', 0, 0, this.authService.getLoggedUserToken(), this.server);
            this.module = new core.AMTDesktop(this.logger, this.context);
            this.dataProcessor = new core.DataProcessor(this.logger, this.redirector, this.module);
            this.mouseHelper = new core.MouseHelper(this.module, this.redirector, 200);
            this.keyboardHelper = new core.KeyBoardHelper(this.module, this.redirector);
            this.redirector.onProcessData = this.module.processData.bind(this.module);
            this.redirector.onStart = this.module.start.bind(this.module);
            this.redirector.onNewState = this.module.onStateChange.bind(this.module);
            this.redirector.onSendKvmData = this.module.onSendKvmData.bind(this.module);
            this.redirector.onStateChanged = this.onConnectionStateChange.bind(this);
            this.redirector.onError = this.onRedirectorError.bind(this);
            this.module.onSend = this.redirector.send.bind(this.redirector);
            this.module.onProcessData = this.dataProcessor.processData.bind(this.dataProcessor);
            this.module.bpp = this.selected;
            this.mouseMove = rxjs.fromEvent((_b = this.canvas) === null || _b === void 0 ? void 0 : _b.nativeElement, 'mousemove');
            this.mouseMove.pipe(operators.throttleTime(200)).subscribe(function (event) {
                if (_this.mouseHelper != null) {
                    _this.mouseHelper.mousemove(event);
                }
            });
        };
        KvmComponent.prototype.onRedirectorError = function () {
            this.reset();
        };
        KvmComponent.prototype.init = function () {
            var _this = this;
            this.devicesService
                .getPowerState(this.deviceId)
                .pipe(operators.catchError(function () {
                // this.snackBar.open(`Error retrieving power status`, undefined, SnackbarDefaults.defaultError)
                return rxjs.of();
            }), operators.finalize(function () { }))
                .subscribe(function (data) {
                _this.powerState = data;
                _this.isPoweredOn = _this.checkPowerStatus();
                if (!_this.isPoweredOn) {
                    _this.isLoading = false;
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
                    _this.instantiate();
                    setTimeout(function () {
                        _this.isLoading = false;
                        _this.autoConnect();
                    }, 0);
                }
            });
        };
        KvmComponent.prototype.setAmtFeatures = function () {
            var _this = this;
            this.isLoading = true;
            console.log('coming inside in setAmtfeatures');
            this.devicesService
                .setAmtFeatures(this.deviceId)
                .pipe(operators.catchError(function () {
                // this.snackBar.open(`Error enabling kvm`, undefined, SnackbarDefaults.defaultError)
                _this.init();
                return rxjs.of();
            }), operators.finalize(function () { }))
                .subscribe(function () { return _this.init(); });
        };
        KvmComponent.prototype.autoConnect = function () {
            if (this.redirector != null) {
                this.redirector.start(WebSocket);
                this.keyboardHelper.GrabKeyInput();
            }
        };
        KvmComponent.prototype.onEncodingChange = function () {
            var _this = this;
            this.stopKvm();
            rxjs.timer(1000).subscribe(function () {
                _this.autoConnect();
            });
        };
        KvmComponent.prototype.checkPowerStatus = function () {
            return this.powerState.powerstate === 2;
        };
        KvmComponent.prototype.ngDoCheck = function () {
            if (this.selectedAction !== this.previousAction) {
                this.previousAction = this.selectedAction;
            }
        };
        KvmComponent.prototype.onMouseup = function (event) {
            if (this.mouseHelper != null) {
                this.mouseHelper.mouseup(event);
            }
        };
        KvmComponent.prototype.onMousedown = function (event) {
            if (this.mouseHelper != null) {
                this.mouseHelper.mousedown(event);
            }
        };
        KvmComponent.prototype.ngOnDestroy = function () {
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
        };
        return KvmComponent;
    }());
    KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(i0.ɵɵdirectiveInject(AuthService), i0.ɵɵdirectiveInject(KvmService)); };
    KvmComponent.ɵcmp = i0.ɵɵdefineComponent({ type: KvmComponent, selectors: [["amt-kvm"]], viewQuery: function KvmComponent_Query(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵviewQuery(_c0, 1);
            }
            if (rf & 2) {
                var _t = void 0;
                i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
            }
        }, inputs: { width: "width", height: "height" }, outputs: { deviceState: "deviceState", deviceStatus: "deviceStatus" }, decls: 5, vars: 2, consts: [[2, "display", "block"], ["oncontextmenu", "return false", 1, "canvas", 3, "width", "height", "mouseup", "mousedown"], ["canvas", ""]], template: function KvmComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "div");
                i0.ɵɵelementStart(1, "button", 0);
                i0.ɵɵtext(2, " connect ");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(3, "canvas", 1, 2);
                i0.ɵɵlistener("mouseup", function KvmComponent_Template_canvas_mouseup_3_listener($event) { return ctx.onMouseup($event); })("mousedown", function KvmComponent_Template_canvas_mousedown_3_listener($event) { return ctx.onMousedown($event); });
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
            }
            if (rf & 2) {
                i0.ɵɵadvance(3);
                i0.ɵɵproperty("width", ctx.width)("height", ctx.height);
            }
        }, encapsulation: 2 });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'amt-kvm',
                        templateUrl: './kvm.component.html',
                        styles: [],
                    }]
            }], function () { return [{ type: AuthService }, { type: KvmService }]; }, { canvas: [{
                    type: i0.ViewChild,
                    args: ['canvas', { static: false }]
                }], width: [{
                    type: i0.Input
                }], height: [{
                    type: i0.Input
                }], deviceState: [{
                    type: i0.Output
                }], deviceStatus: [{
                    type: i0.Output
                }] });
    })();

    var DeviceToolbarComponent = /** @class */ (function () {
        function DeviceToolbarComponent() {
        }
        DeviceToolbarComponent.prototype.ngOnInit = function () {
        };
        return DeviceToolbarComponent;
    }());
    DeviceToolbarComponent.ɵfac = function DeviceToolbarComponent_Factory(t) { return new (t || DeviceToolbarComponent)(); };
    DeviceToolbarComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DeviceToolbarComponent, selectors: [["amt-device-toolbar"]], decls: 6, vars: 0, template: function DeviceToolbarComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "div");
                i0.ɵɵtext(1, "Device Control");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(2, "div");
                i0.ɵɵtext(3, "List");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(4, "button");
                i0.ɵɵtext(5, "tv");
                i0.ɵɵelementEnd();
            }
        }, styles: [""] });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DeviceToolbarComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'amt-device-toolbar',
                        templateUrl: './device-toolbar.component.html',
                        styleUrls: ['./device-toolbar.component.css']
                    }]
            }], function () { return []; }, null);
    })();

    var KvmModule = /** @class */ (function () {
        function KvmModule() {
        }
        return KvmModule;
    }());
    KvmModule.ɵfac = function KvmModule_Factory(t) { return new (t || KvmModule)(); };
    KvmModule.ɵmod = i0.ɵɵdefineNgModule({ type: KvmModule });
    KvmModule.ɵinj = i0.ɵɵdefineInjector({ providers: [AuthService, KvmService], imports: [[i1.HttpClientModule, platformBrowser.BrowserModule]] });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(KvmModule, { declarations: [KvmComponent, DeviceToolbarComponent], imports: [i1.HttpClientModule, platformBrowser.BrowserModule], exports: [KvmComponent] }); })();
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmModule, [{
                type: i0.NgModule,
                args: [{
                        declarations: [KvmComponent, DeviceToolbarComponent],
                        imports: [i1.HttpClientModule, platformBrowser.BrowserModule],
                        exports: [KvmComponent],
                        schemas: [i0.CUSTOM_ELEMENTS_SCHEMA],
                        providers: [AuthService, KvmService],
                    }]
            }], null, null);
    })();

    /*
     * Public API Surface of kvm
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.KvmComponent = KvmComponent;
    exports.KvmModule = KvmModule;
    exports.KvmService = KvmService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=kvm.umd.js.map
