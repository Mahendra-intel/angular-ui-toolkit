(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@open-amt-cloud-toolkit/ui-toolkit/core')) :
    typeof define === 'function' && define.amd ? define('kvm', ['exports', '@angular/core', '@open-amt-cloud-toolkit/ui-toolkit/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.kvm = {}, global.ng.core, global['@open-amt-cloud-toolkit']['ui-toolkit'].core));
}(this, (function (exports, i0, core) { 'use strict';

    var KvmService = /** @class */ (function () {
        function KvmService() {
        }
        return KvmService;
    }());
    KvmService.ɵfac = function KvmService_Factory(t) { return new (t || KvmService)(); };
    KvmService.ɵprov = i0.ɵɵdefineInjectable({ token: KvmService, factory: KvmService.ɵfac, providedIn: 'root' });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return []; }, null);
    })();

    var environment = {
        production: false,
        mpsServer: 'https://localhost/mps',
        rpsServer: 'https://localhost/rps'
    };

    var _c0 = ["canvas"];
    // import { ActivatedRoute, Router } from '@angular/router';
    var KvmComponent = /** @class */ (function () {
        function KvmComponent() {
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
            console.log('comming inside with new bundle files');
            if (environment.mpsServer.includes('/mps')) {
                //handles kong route
                this.server = environment.mpsServer.replace('http', 'ws') + "/ws/relay";
            }
        }
        // ngOnDestroy(): void {
        //   throw new Error('Method not implemented.');
        // }
        // ngAfterViewInit(): void {
        //   throw new Error('Method not implemented.');
        // }
        KvmComponent.prototype.ngOnInit = function () {
            this.logger = new core.ConsoleLogger(1);
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
        return KvmComponent;
    }());
    KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(); };
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
            }], function () { return []; }, { canvas: [{
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
    KvmModule.ɵinj = i0.ɵɵdefineInjector({ imports: [[]] });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(KvmModule, { declarations: [KvmComponent, DeviceToolbarComponent], exports: [KvmComponent] }); })();
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmModule, [{
                type: i0.NgModule,
                args: [{
                        declarations: [KvmComponent, DeviceToolbarComponent],
                        imports: [],
                        exports: [KvmComponent],
                        schemas: [i0.CUSTOM_ELEMENTS_SCHEMA]
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
