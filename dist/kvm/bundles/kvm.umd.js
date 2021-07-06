(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/operators'), require('@angular/common/http'), require('@open-amt-cloud-toolkit/ui-toolkit/core'), require('rxjs'), require('@angular/platform-browser'), require('@angular/platform-browser/animations'), require('@angular/flex-layout'), require('@angular/common'), require('@angular/forms'), require('@angular/material/grid-list'), require('@angular/material/expansion'), require('@angular/material/stepper'), require('@angular/material/chips'), require('@angular/material/core'), require('@angular/material/table'), require('@angular/material/card'), require('@angular/material/dialog'), require('@angular/material/list'), require('@angular/material/paginator'), require('@angular/material/sort'), require('@angular/material/checkbox'), require('@angular/material/tooltip'), require('@angular/material/autocomplete'), require('@angular/material/snack-bar'), require('@angular/material/input'), require('@angular/material/form-field'), require('@angular/material/radio'), require('@angular/material/select'), require('@angular/material/slide-toggle'), require('@angular/material/progress-bar'), require('@angular/material/datepicker'), require('@angular/material/progress-spinner'), require('@angular/material/icon'), require('@angular/material/toolbar'), require('@angular/material/sidenav'), require('@angular/material/menu'), require('@angular/material/button'), require('@angular/material/tabs'), require('@angular/material/tree'), require('@angular/material/button-toggle'), require('@angular/cdk/table')) :
    typeof define === 'function' && define.amd ? define('kvm', ['exports', '@angular/core', 'rxjs/operators', '@angular/common/http', '@open-amt-cloud-toolkit/ui-toolkit/core', 'rxjs', '@angular/platform-browser', '@angular/platform-browser/animations', '@angular/flex-layout', '@angular/common', '@angular/forms', '@angular/material/grid-list', '@angular/material/expansion', '@angular/material/stepper', '@angular/material/chips', '@angular/material/core', '@angular/material/table', '@angular/material/card', '@angular/material/dialog', '@angular/material/list', '@angular/material/paginator', '@angular/material/sort', '@angular/material/checkbox', '@angular/material/tooltip', '@angular/material/autocomplete', '@angular/material/snack-bar', '@angular/material/input', '@angular/material/form-field', '@angular/material/radio', '@angular/material/select', '@angular/material/slide-toggle', '@angular/material/progress-bar', '@angular/material/datepicker', '@angular/material/progress-spinner', '@angular/material/icon', '@angular/material/toolbar', '@angular/material/sidenav', '@angular/material/menu', '@angular/material/button', '@angular/material/tabs', '@angular/material/tree', '@angular/material/button-toggle', '@angular/cdk/table'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.kvm = {}, global.ng.core, global.rxjs.operators, global.ng.common.http, global['@open-amt-cloud-toolkit']['ui-toolkit'].core, global.rxjs, global.ng.platformBrowser, global.ng.platformBrowser.animations, global.ng.flexLayout, global.ng.common, global.ng.forms, global.ng.material.gridList, global.ng.material.expansion, global.ng.material.stepper, global.ng.material.chips, global.ng.material.core, global.ng.material.table, global.ng.material.card, global.ng.material.dialog, global.ng.material.list, global.ng.material.paginator, global.ng.material.sort, global.ng.material.checkbox, global.ng.material.tooltip, global.ng.material.autocomplete, global.ng.material.snackBar, global.ng.material.input, global.ng.material.formField, global.ng.material.radio, global.ng.material.select, global.ng.material.slideToggle, global.ng.material.progressBar, global.ng.material.datepicker, global.ng.material.progressSpinner, global.ng.material.icon, global.ng.material.toolbar, global.ng.material.sidenav, global.ng.material.menu, global.ng.material.button, global.ng.material.tabs, global.ng.material.tree, global.ng.material.buttonToggle, global.ng.cdk.table));
}(this, (function (exports, i0, operators, i1, core, rxjs, platformBrowser, animations, flexLayout, common, forms, gridList, expansion, stepper, chips, core$1, table, card, i1$1, list, paginator, sort, checkbox, tooltip, autocomplete, snackBar, input, formField, radio, select, slideToggle, progressBar, datepicker, progressSpinner, icon, toolbar, sidenav, menu, i2, tabs, tree, buttonToggle, table$1) { 'use strict';

    var environment = {
        production: false,
        mpsServer: 'https://52.172.14.137/mps',
        rpsServer: 'https://52.172.14.137/rps'
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

    var _c0 = ["canvas"];
    var KvmComponent = /** @class */ (function () {
        function KvmComponent(params) {
            var _this = this;
            this.params = params;
            // //setting a width and height for the canvas
            this.width = 400;
            this.height = 400;
            this.deviceState = 0;
            this.deviceStatus = new i0.EventEmitter();
            this.deviceConnection = new i0.EventEmitter();
            this.selectedEncoding = new i0.EventEmitter();
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
            this.deviceId = this.params.deviceId;
            if (environment.mpsServer.includes('/mps')) {
                //handles kong route
                this.server = environment.mpsServer.replace('http', 'ws') + "/ws/relay";
            }
        }
        KvmComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.logger = new core.ConsoleLogger(1);
            this.deviceConnection.subscribe(function (data) {
                if (data === true) {
                    _this.init();
                }
                else {
                    _this.stopKvm();
                }
            });
            this.selectedEncoding.subscribe(function (data) {
                _this.selected = data;
                _this.onEncodingChange();
            });
        };
        KvmComponent.prototype.ngAfterViewInit = function () {
            this.init();
        };
        KvmComponent.prototype.instantiate = function () {
            var _this = this;
            var _a, _b;
            this.context = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.nativeElement.getContext('2d');
            this.redirector = new core.AMTKvmDataRedirector(this.logger, core.Protocol.KVM, new FileReader(), this.deviceId, 16994, '', '', 0, 0, this.params.authToken, this.server);
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
            this.instantiate();
            setTimeout(function () {
                _this.isLoading = false;
                _this.autoConnect();
            }, 4000);
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
        KvmComponent.prototype.onMousemove = function (event) {
            if (this.mouseHelper != null) {
                this.mouseHelper.mousemove(event);
            }
        };
        KvmComponent.prototype.ngOnDestroy = function () {
            this.stopKvm();
        };
        return KvmComponent;
    }());
    KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(i0.ɵɵdirectiveInject('userInput')); };
    KvmComponent.ɵcmp = i0.ɵɵdefineComponent({ type: KvmComponent, selectors: [["amt-kvm"]], viewQuery: function KvmComponent_Query(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵviewQuery(_c0, 1);
            }
            if (rf & 2) {
                var _t = void 0;
                i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
            }
        }, inputs: { width: "width", height: "height", deviceConnection: "deviceConnection", selectedEncoding: "selectedEncoding" }, outputs: { deviceState: "deviceState", deviceStatus: "deviceStatus" }, decls: 3, vars: 2, consts: [["oncontextmenu", "return false", 1, "canvas", 3, "width", "height", "mouseup", "mousedown", "mousemove"], ["canvas", ""]], template: function KvmComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "div");
                i0.ɵɵelementStart(1, "canvas", 0, 1);
                i0.ɵɵlistener("mouseup", function KvmComponent_Template_canvas_mouseup_1_listener($event) { return ctx.onMouseup($event); })("mousedown", function KvmComponent_Template_canvas_mousedown_1_listener($event) { return ctx.onMousedown($event); })("mousemove", function KvmComponent_Template_canvas_mousemove_1_listener($event) { return ctx.onMousemove($event); });
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
            }
            if (rf & 2) {
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("width", ctx.width)("height", ctx.height);
            }
        }, styles: [".canvas[_ngcontent-%COMP%]{max-height:80%;max-width:100%}"] });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'amt-kvm',
                        templateUrl: './kvm.component.html',
                        styleUrls: ['./kvm.component.css'],
                    }]
            }], function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: ['userInput']
                        }] }];
        }, { canvas: [{
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
                }], deviceConnection: [{
                    type: i0.Input
                }], selectedEncoding: [{
                    type: i0.Input
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

    var AreYouSureDialogComponent = /** @class */ (function () {
        function AreYouSureDialogComponent() {
        }
        AreYouSureDialogComponent.prototype.ngOnInit = function () {
        };
        return AreYouSureDialogComponent;
    }());
    AreYouSureDialogComponent.ɵfac = function AreYouSureDialogComponent_Factory(t) { return new (t || AreYouSureDialogComponent)(); };
    AreYouSureDialogComponent.ɵcmp = i0.ɵɵdefineComponent({ type: AreYouSureDialogComponent, selectors: [["amt-are-you-sure"]], decls: 0, vars: 0, template: function AreYouSureDialogComponent_Template(rf, ctx) { }, styles: [""] });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AreYouSureDialogComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'amt-are-you-sure',
                        templateUrl: './are-you-sure.component.html',
                        styleUrls: ['./are-you-sure.component.scss']
                    }]
            }], function () { return []; }, null);
    })();

    var PowerUpAlertComponent = /** @class */ (function () {
        function PowerUpAlertComponent() {
        }
        PowerUpAlertComponent.prototype.ngOnInit = function () {
        };
        return PowerUpAlertComponent;
    }());
    PowerUpAlertComponent.ɵfac = function PowerUpAlertComponent_Factory(t) { return new (t || PowerUpAlertComponent)(); };
    PowerUpAlertComponent.ɵcmp = i0.ɵɵdefineComponent({ type: PowerUpAlertComponent, selectors: [["amt-power-up-alert"]], decls: 9, vars: 1, consts: [["mat-dialog-title", ""], [1, "mat-typography"], ["align", "end"], ["mat-button", "", "mat-dialog-close", ""], ["mat-button", "", "cdkFocusInitial", "", 3, "mat-dialog-close"]], template: function PowerUpAlertComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "h2", 0);
                i0.ɵɵtext(1, "Your device is not powered on");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(2, "mat-dialog-content", 1);
                i0.ɵɵtext(3, " Do you want to send a power up command to the device?\n");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(4, "mat-dialog-actions", 2);
                i0.ɵɵelementStart(5, "button", 3);
                i0.ɵɵtext(6, "No");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(7, "button", 4);
                i0.ɵɵtext(8, "Yes");
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
            }
            if (rf & 2) {
                i0.ɵɵadvance(7);
                i0.ɵɵproperty("mat-dialog-close", true);
            }
        }, directives: [i1$1.MatDialogTitle, i1$1.MatDialogContent, i1$1.MatDialogActions, i2.MatButton, i1$1.MatDialogClose], styles: [""] });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PowerUpAlertComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'amt-power-up-alert',
                        templateUrl: './power-up-alert.component.html',
                        styleUrls: ['./power-up-alert.component.scss']
                    }]
            }], function () { return []; }, null);
    })();

    var DialogContentComponent = /** @class */ (function () {
        function DialogContentComponent(data) {
            this.data = data;
        }
        DialogContentComponent.prototype.ngOnInit = function () { };
        return DialogContentComponent;
    }());
    DialogContentComponent.ɵfac = function DialogContentComponent_Factory(t) { return new (t || DialogContentComponent)(i0.ɵɵdirectiveInject(i1$1.MAT_DIALOG_DATA)); };
    DialogContentComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DialogContentComponent, selectors: [["amt-dialog-content"]], decls: 0, vars: 0, template: function DialogContentComponent_Template(rf, ctx) { }, styles: [""] });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DialogContentComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'amt-dialog-content',
                        templateUrl: './dialog-content.component.html',
                        styleUrls: ['./dialog-content.component.scss'],
                    }]
            }], function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [i1$1.MAT_DIALOG_DATA]
                        }] }];
        }, null);
    })();

    /*********************************************************************
    * Copyright (c) Intel Corporation 2021
    * SPDX-License-Identifier: Apache-2.0
    **********************************************************************/
    // import { HttpClientModule } from '@angular/common/http'
    var OpenAMTMaterialModule = /** @class */ (function () {
        function OpenAMTMaterialModule() {
        }
        return OpenAMTMaterialModule;
    }());
    OpenAMTMaterialModule.ɵfac = function OpenAMTMaterialModule_Factory(t) { return new (t || OpenAMTMaterialModule)(); };
    OpenAMTMaterialModule.ɵmod = i0.ɵɵdefineNgModule({ type: OpenAMTMaterialModule });
    OpenAMTMaterialModule.ɵinj = i0.ɵɵdefineInjector({ providers: [
            { provide: snackBar.MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 30000, panelClass: ['success', 'mat-elevation-z12'] } }
        ], imports: [[
                flexLayout.FlexLayoutModule,
                forms.ReactiveFormsModule,
                forms.FormsModule,
                core$1.MatNativeDateModule,
                table.MatTableModule,
                tree.MatTreeModule,
                menu.MatMenuModule,
                table$1.CdkTableModule,
                buttonToggle.MatButtonToggleModule,
                radio.MatRadioModule,
                sort.MatSortModule,
                checkbox.MatCheckboxModule,
                tooltip.MatTooltipModule,
                snackBar.MatSnackBarModule,
                expansion.MatExpansionModule,
                gridList.MatGridListModule,
                chips.MatChipsModule,
                select.MatSelectModule,
                list.MatListModule,
                card.MatCardModule,
                autocomplete.MatAutocompleteModule,
                stepper.MatStepperModule,
                i1$1.MatDialogModule,
                sidenav.MatSidenavModule,
                input.MatInputModule,
                slideToggle.MatSlideToggleModule,
                datepicker.MatDatepickerModule,
                progressBar.MatProgressBarModule,
                progressSpinner.MatProgressSpinnerModule,
                toolbar.MatToolbarModule,
                icon.MatIconModule,
                tabs.MatTabsModule,
                formField.MatFormFieldModule,
                i2.MatButtonModule,
                paginator.MatPaginatorModule
            ], flexLayout.FlexLayoutModule,
            forms.ReactiveFormsModule,
            forms.FormsModule,
            autocomplete.MatAutocompleteModule,
            datepicker.MatDatepickerModule,
            table.MatTableModule,
            tree.MatTreeModule,
            icon.MatIconModule,
            sort.MatSortModule,
            buttonToggle.MatButtonToggleModule,
            tooltip.MatTooltipModule,
            gridList.MatGridListModule,
            radio.MatRadioModule,
            checkbox.MatCheckboxModule,
            expansion.MatExpansionModule,
            menu.MatMenuModule,
            i1$1.MatDialogModule,
            snackBar.MatSnackBarModule,
            list.MatListModule,
            stepper.MatStepperModule,
            chips.MatChipsModule,
            card.MatCardModule,
            select.MatSelectModule,
            input.MatInputModule,
            toolbar.MatToolbarModule,
            tabs.MatTabsModule,
            formField.MatFormFieldModule,
            i2.MatButtonModule,
            progressBar.MatProgressBarModule, progressSpinner.MatProgressSpinnerModule,
            slideToggle.MatSlideToggleModule,
            sidenav.MatSidenavModule,
            paginator.MatPaginatorModule,
            table$1.CdkTableModule,
            core$1.MatNativeDateModule] });
    (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(OpenAMTMaterialModule, { declarations: [AreYouSureDialogComponent, PowerUpAlertComponent, DialogContentComponent], imports: [flexLayout.FlexLayoutModule,
                forms.ReactiveFormsModule,
                forms.FormsModule,
                core$1.MatNativeDateModule,
                table.MatTableModule,
                tree.MatTreeModule,
                menu.MatMenuModule,
                table$1.CdkTableModule,
                buttonToggle.MatButtonToggleModule,
                radio.MatRadioModule,
                sort.MatSortModule,
                checkbox.MatCheckboxModule,
                tooltip.MatTooltipModule,
                snackBar.MatSnackBarModule,
                expansion.MatExpansionModule,
                gridList.MatGridListModule,
                chips.MatChipsModule,
                select.MatSelectModule,
                list.MatListModule,
                card.MatCardModule,
                autocomplete.MatAutocompleteModule,
                stepper.MatStepperModule,
                i1$1.MatDialogModule,
                sidenav.MatSidenavModule,
                input.MatInputModule,
                slideToggle.MatSlideToggleModule,
                datepicker.MatDatepickerModule,
                progressBar.MatProgressBarModule,
                progressSpinner.MatProgressSpinnerModule,
                toolbar.MatToolbarModule,
                icon.MatIconModule,
                tabs.MatTabsModule,
                formField.MatFormFieldModule,
                i2.MatButtonModule,
                paginator.MatPaginatorModule], exports: [flexLayout.FlexLayoutModule,
                forms.ReactiveFormsModule,
                forms.FormsModule,
                autocomplete.MatAutocompleteModule,
                datepicker.MatDatepickerModule,
                table.MatTableModule,
                tree.MatTreeModule,
                icon.MatIconModule,
                sort.MatSortModule,
                buttonToggle.MatButtonToggleModule,
                tooltip.MatTooltipModule,
                gridList.MatGridListModule,
                radio.MatRadioModule,
                checkbox.MatCheckboxModule,
                expansion.MatExpansionModule,
                menu.MatMenuModule,
                i1$1.MatDialogModule,
                snackBar.MatSnackBarModule,
                list.MatListModule,
                stepper.MatStepperModule,
                chips.MatChipsModule,
                card.MatCardModule,
                select.MatSelectModule,
                input.MatInputModule,
                toolbar.MatToolbarModule,
                tabs.MatTabsModule,
                formField.MatFormFieldModule,
                i2.MatButtonModule,
                progressBar.MatProgressBarModule, progressSpinner.MatProgressSpinnerModule,
                slideToggle.MatSlideToggleModule,
                sidenav.MatSidenavModule,
                paginator.MatPaginatorModule,
                table$1.CdkTableModule,
                core$1.MatNativeDateModule] });
    })();
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(OpenAMTMaterialModule, [{
                type: i0.NgModule,
                args: [{
                        imports: [
                            flexLayout.FlexLayoutModule,
                            forms.ReactiveFormsModule,
                            forms.FormsModule,
                            core$1.MatNativeDateModule,
                            table.MatTableModule,
                            tree.MatTreeModule,
                            menu.MatMenuModule,
                            table$1.CdkTableModule,
                            buttonToggle.MatButtonToggleModule,
                            radio.MatRadioModule,
                            sort.MatSortModule,
                            checkbox.MatCheckboxModule,
                            tooltip.MatTooltipModule,
                            snackBar.MatSnackBarModule,
                            expansion.MatExpansionModule,
                            gridList.MatGridListModule,
                            chips.MatChipsModule,
                            select.MatSelectModule,
                            list.MatListModule,
                            card.MatCardModule,
                            autocomplete.MatAutocompleteModule,
                            stepper.MatStepperModule,
                            i1$1.MatDialogModule,
                            sidenav.MatSidenavModule,
                            input.MatInputModule,
                            slideToggle.MatSlideToggleModule,
                            datepicker.MatDatepickerModule,
                            progressBar.MatProgressBarModule,
                            progressSpinner.MatProgressSpinnerModule,
                            toolbar.MatToolbarModule,
                            icon.MatIconModule,
                            tabs.MatTabsModule,
                            formField.MatFormFieldModule,
                            i2.MatButtonModule,
                            paginator.MatPaginatorModule
                        ],
                        exports: [
                            flexLayout.FlexLayoutModule,
                            forms.ReactiveFormsModule,
                            forms.FormsModule,
                            autocomplete.MatAutocompleteModule,
                            datepicker.MatDatepickerModule,
                            table.MatTableModule,
                            tree.MatTreeModule,
                            icon.MatIconModule,
                            sort.MatSortModule,
                            buttonToggle.MatButtonToggleModule,
                            tooltip.MatTooltipModule,
                            gridList.MatGridListModule,
                            radio.MatRadioModule,
                            checkbox.MatCheckboxModule,
                            expansion.MatExpansionModule,
                            menu.MatMenuModule,
                            i1$1.MatDialogModule,
                            snackBar.MatSnackBarModule,
                            list.MatListModule,
                            stepper.MatStepperModule,
                            chips.MatChipsModule,
                            card.MatCardModule,
                            select.MatSelectModule,
                            input.MatInputModule,
                            toolbar.MatToolbarModule,
                            tabs.MatTabsModule,
                            formField.MatFormFieldModule,
                            i2.MatButtonModule,
                            progressBar.MatProgressBarModule, progressSpinner.MatProgressSpinnerModule,
                            slideToggle.MatSlideToggleModule,
                            sidenav.MatSidenavModule,
                            paginator.MatPaginatorModule,
                            table$1.CdkTableModule,
                            core$1.MatNativeDateModule
                        ],
                        providers: [
                            { provide: snackBar.MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 30000, panelClass: ['success', 'mat-elevation-z12'] } }
                        ],
                        declarations: [AreYouSureDialogComponent, PowerUpAlertComponent, DialogContentComponent]
                    }]
            }], null, null);
    })();
    var SharedModule = /** @class */ (function () {
        function SharedModule() {
        }
        SharedModule.forRoot = function () {
            return {
                ngModule: SharedModule,
                providers: []
            };
        };
        return SharedModule;
    }());
    SharedModule.ɵfac = function SharedModule_Factory(t) { return new (t || SharedModule)(); };
    SharedModule.ɵmod = i0.ɵɵdefineNgModule({ type: SharedModule });
    SharedModule.ɵinj = i0.ɵɵdefineInjector({ imports: [[
                common.CommonModule,
                OpenAMTMaterialModule
            ], OpenAMTMaterialModule] });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SharedModule, { imports: [common.CommonModule, OpenAMTMaterialModule], exports: [OpenAMTMaterialModule] }); })();
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SharedModule, [{
                type: i0.NgModule,
                args: [{
                        declarations: [],
                        exports: [OpenAMTMaterialModule],
                        imports: [
                            common.CommonModule,
                            OpenAMTMaterialModule
                        ]
                    }]
            }], null, null);
    })();

    var AuthorizeInterceptor = /** @class */ (function () {
        function AuthorizeInterceptor(params, dialog) {
            this.params = params;
            this.dialog = dialog;
        }
        AuthorizeInterceptor.prototype.intercept = function (request, next) {
            var _this = this;
            request = request.clone({
                setHeaders: {
                    Authorization: "Bearer " + this.params.authToken,
                },
            });
            return next.handle(request).pipe(operators.tap(function (data) {
                if (data instanceof i1.HttpResponse) {
                    return data;
                }
                return null;
            }, function (error) {
                if (error instanceof i1.HttpErrorResponse) {
                    if (error.status === 401) {
                        _this.dialog.open(DialogContentComponent, {
                            data: { name: 'session time out. Please login again' },
                        });
                    }
                }
                return rxjs.throwError(error);
            }));
        };
        return AuthorizeInterceptor;
    }());
    AuthorizeInterceptor.ɵfac = function AuthorizeInterceptor_Factory(t) { return new (t || AuthorizeInterceptor)(i0.ɵɵinject('userInput'), i0.ɵɵinject(i1$1.MatDialog)); };
    AuthorizeInterceptor.ɵprov = i0.ɵɵdefineInjectable({ token: AuthorizeInterceptor, factory: AuthorizeInterceptor.ɵfac });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthorizeInterceptor, [{
                type: i0.Injectable
            }], function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: ['userInput']
                        }] }, { type: i1$1.MatDialog }];
        }, null);
    })();

    var KvmModule = /** @class */ (function () {
        function KvmModule() {
        }
        KvmModule.forRoot = function (param) {
            return {
                ngModule: KvmModule,
                providers: [
                    KvmService,
                    {
                        provide: 'userInput',
                        useValue: param,
                    },
                ],
            };
        };
        return KvmModule;
    }());
    KvmModule.ɵfac = function KvmModule_Factory(t) { return new (t || KvmModule)(); };
    KvmModule.ɵmod = i0.ɵɵdefineNgModule({ type: KvmModule });
    KvmModule.ɵinj = i0.ɵɵdefineInjector({ providers: [
            {
                provide: i1.HTTP_INTERCEPTORS,
                useClass: AuthorizeInterceptor,
                multi: true,
            },
        ], imports: [[
                i1.HttpClientModule,
                flexLayout.FlexLayoutModule,
                platformBrowser.BrowserModule,
                SharedModule.forRoot(),
                animations.BrowserAnimationsModule,
            ]] });
    (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(KvmModule, { declarations: [KvmComponent, DeviceToolbarComponent], imports: [i1.HttpClientModule,
                flexLayout.FlexLayoutModule,
                platformBrowser.BrowserModule, SharedModule, animations.BrowserAnimationsModule], exports: [KvmComponent] });
    })();
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KvmModule, [{
                type: i0.NgModule,
                args: [{
                        declarations: [KvmComponent, DeviceToolbarComponent],
                        imports: [
                            i1.HttpClientModule,
                            flexLayout.FlexLayoutModule,
                            platformBrowser.BrowserModule,
                            SharedModule.forRoot(),
                            animations.BrowserAnimationsModule,
                        ],
                        exports: [KvmComponent],
                        schemas: [i0.CUSTOM_ELEMENTS_SCHEMA],
                        providers: [
                            {
                                provide: i1.HTTP_INTERCEPTORS,
                                useClass: AuthorizeInterceptor,
                                multi: true,
                            },
                        ],
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
