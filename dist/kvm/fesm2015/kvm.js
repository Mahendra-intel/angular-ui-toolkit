import { EventEmitter, ɵɵinject, ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, ɵɵdefineComponent, ɵɵelementStart, ɵɵtext, ɵɵelementEnd, ɵɵadvance, ɵɵproperty, Component, ɵɵdirectiveInject, ɵɵviewQuery, ɵɵqueryRefresh, ɵɵloadQuery, ɵɵlistener, Inject, ViewChild, Input, Output, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { catchError, mergeMap, throttleTime, finalize, tap } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpErrorResponse, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ConsoleLogger, AMTKvmDataRedirector, Protocol, AMTDesktop, DataProcessor, MouseHelper, KeyBoardHelper } from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { interval, fromEvent, of, timer, throwError } from 'rxjs';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CdkTableModule } from '@angular/cdk/table';

const environment = {
    production: false,
    mpsServer: 'https://52.172.14.137/mps',
    rpsServer: 'https://52.172.14.137/rps'
};

class KvmService {
    constructor(http) {
        this.http = http;
        this.connectKVMSocket = new EventEmitter(false);
        this.stopwebSocket = new EventEmitter(false);
    }
    setAmtFeatures(deviceId) {
        const payload = {
            userConsent: 'none',
            enableKVM: true,
            enableSOL: true,
            enableIDER: true,
        };
        return this.http
            .post(`${environment.mpsServer}/api/v1/amt/features/${deviceId}`, payload)
            .pipe(catchError((err) => {
            throw err;
        }));
    }
    getPowerState(deviceId) {
        return this.http
            .get(`${environment.mpsServer}/api/v1/amt/power/state/${deviceId}`)
            .pipe(catchError((err) => {
            throw err;
        }));
    }
    sendPowerAction(deviceId, action, useSOL = false) {
        const payload = {
            method: 'PowerAction',
            action,
            useSOL,
        };
        return this.http
            .post(`${environment.mpsServer}/api/v1/amt/power/action/${deviceId}`, payload)
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
                providedIn: 'platform',
            }]
    }], function () { return [{ type: HttpClient }]; }, null); })();

class PowerUpAlertComponent {
    constructor() { }
    ngOnInit() {
    }
}
PowerUpAlertComponent.ɵfac = function PowerUpAlertComponent_Factory(t) { return new (t || PowerUpAlertComponent)(); };
PowerUpAlertComponent.ɵcmp = ɵɵdefineComponent({ type: PowerUpAlertComponent, selectors: [["amt-power-up-alert"]], decls: 9, vars: 1, consts: [["mat-dialog-title", ""], [1, "mat-typography"], ["align", "end"], ["mat-button", "", "mat-dialog-close", ""], ["mat-button", "", "cdkFocusInitial", "", 3, "mat-dialog-close"]], template: function PowerUpAlertComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "h2", 0);
        ɵɵtext(1, "Your device is not powered on");
        ɵɵelementEnd();
        ɵɵelementStart(2, "mat-dialog-content", 1);
        ɵɵtext(3, " Do you want to send a power up command to the device?\n");
        ɵɵelementEnd();
        ɵɵelementStart(4, "mat-dialog-actions", 2);
        ɵɵelementStart(5, "button", 3);
        ɵɵtext(6, "No");
        ɵɵelementEnd();
        ɵɵelementStart(7, "button", 4);
        ɵɵtext(8, "Yes");
        ɵɵelementEnd();
        ɵɵelementEnd();
    } if (rf & 2) {
        ɵɵadvance(7);
        ɵɵproperty("mat-dialog-close", true);
    } }, directives: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose], styles: [""] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(PowerUpAlertComponent, [{
        type: Component,
        args: [{
                selector: 'amt-power-up-alert',
                templateUrl: './power-up-alert.component.html',
                styleUrls: ['./power-up-alert.component.scss']
            }]
    }], function () { return []; }, null); })();

const SnackbarDefaults = {
    defaultError: { duration: 3000, panelClass: ['error', 'mat-elevation-z12'] },
    longError: { duration: 10000, panelClass: ['error', 'mat-elevation-z12'] },
    quickError: { duration: 1000, panelClass: ['error', 'mat-elevation-z12'] },
    defaultSuccess: {
        duration: 3000,
        panelClass: ['success', 'mat-elevation-z12'],
    },
    longSuccess: {
        duration: 10000,
        panelClass: ['success', 'mat-elevation-z12'],
    },
    quickSuccess: {
        duration: 1000,
        panelClass: ['success', 'mat-elevation-z12'],
    },
};

const _c0 = ["canvas"];
class KvmComponent {
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
        this.devicesService
            .getPowerState(this.deviceId)
            .pipe(catchError(() => {
            this.snackBar.open(`Error retrieving power status`, undefined, SnackbarDefaults.defaultError);
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
        this.devicesService
            .setAmtFeatures(this.deviceId)
            .pipe(catchError(() => {
            this.snackBar.open(`Error enabling kvm`, undefined, SnackbarDefaults.defaultError);
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
KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(ɵɵdirectiveInject(MatSnackBar), ɵɵdirectiveInject(MatDialog), ɵɵdirectiveInject(KvmService), ɵɵdirectiveInject('userInput')); };
KvmComponent.ɵcmp = ɵɵdefineComponent({ type: KvmComponent, selectors: [["amt-kvm"]], viewQuery: function KvmComponent_Query(rf, ctx) { if (rf & 1) {
        ɵɵviewQuery(_c0, 1);
    } if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.canvas = _t.first);
    } }, inputs: { width: "width", height: "height" }, outputs: { deviceState: "deviceState", deviceStatus: "deviceStatus" }, decls: 3, vars: 2, consts: [["oncontextmenu", "return false", 1, "canvas", 3, "width", "height", "mouseup", "mousedown"], ["canvas", ""]], template: function KvmComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "div");
        ɵɵelementStart(1, "canvas", 0, 1);
        ɵɵlistener("mouseup", function KvmComponent_Template_canvas_mouseup_1_listener($event) { return ctx.onMouseup($event); })("mousedown", function KvmComponent_Template_canvas_mousedown_1_listener($event) { return ctx.onMousedown($event); });
        ɵɵelementEnd();
        ɵɵelementEnd();
    } if (rf & 2) {
        ɵɵadvance(1);
        ɵɵproperty("width", ctx.width)("height", ctx.height);
    } }, encapsulation: 2 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(KvmComponent, [{
        type: Component,
        args: [{
                selector: 'amt-kvm',
                templateUrl: './kvm.component.html',
                styleUrls: []
            }]
    }], function () { return [{ type: MatSnackBar }, { type: MatDialog }, { type: KvmService }, { type: undefined, decorators: [{
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

class AreYouSureDialogComponent {
    constructor() { }
    ngOnInit() {
    }
}
AreYouSureDialogComponent.ɵfac = function AreYouSureDialogComponent_Factory(t) { return new (t || AreYouSureDialogComponent)(); };
AreYouSureDialogComponent.ɵcmp = ɵɵdefineComponent({ type: AreYouSureDialogComponent, selectors: [["amt-are-you-sure"]], decls: 0, vars: 0, template: function AreYouSureDialogComponent_Template(rf, ctx) { }, styles: [""] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(AreYouSureDialogComponent, [{
        type: Component,
        args: [{
                selector: 'amt-are-you-sure',
                templateUrl: './are-you-sure.component.html',
                styleUrls: ['./are-you-sure.component.scss']
            }]
    }], function () { return []; }, null); })();

class DialogContentComponent {
    constructor(data) {
        this.data = data;
    }
    ngOnInit() { }
}
DialogContentComponent.ɵfac = function DialogContentComponent_Factory(t) { return new (t || DialogContentComponent)(ɵɵdirectiveInject(MAT_DIALOG_DATA)); };
DialogContentComponent.ɵcmp = ɵɵdefineComponent({ type: DialogContentComponent, selectors: [["amt-dialog-content"]], decls: 0, vars: 0, template: function DialogContentComponent_Template(rf, ctx) { }, styles: [""] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(DialogContentComponent, [{
        type: Component,
        args: [{
                selector: 'amt-dialog-content',
                templateUrl: './dialog-content.component.html',
                styleUrls: ['./dialog-content.component.scss'],
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: [MAT_DIALOG_DATA]
            }] }]; }, null); })();

/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
// import { HttpClientModule } from '@angular/common/http'
class OpenAMTMaterialModule {
}
OpenAMTMaterialModule.ɵfac = function OpenAMTMaterialModule_Factory(t) { return new (t || OpenAMTMaterialModule)(); };
OpenAMTMaterialModule.ɵmod = ɵɵdefineNgModule({ type: OpenAMTMaterialModule });
OpenAMTMaterialModule.ɵinj = ɵɵdefineInjector({ providers: [
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 30000, panelClass: ['success', 'mat-elevation-z12'] } }
    ], imports: [[
            FlexLayoutModule,
            ReactiveFormsModule,
            FormsModule,
            MatNativeDateModule,
            MatTableModule,
            MatTreeModule,
            MatMenuModule,
            CdkTableModule,
            MatButtonToggleModule,
            MatRadioModule,
            MatSortModule,
            MatCheckboxModule,
            MatTooltipModule,
            MatSnackBarModule,
            MatExpansionModule,
            MatGridListModule,
            MatChipsModule,
            MatSelectModule,
            MatListModule,
            MatCardModule,
            MatAutocompleteModule,
            MatStepperModule,
            MatDialogModule,
            MatSidenavModule,
            MatInputModule,
            MatSlideToggleModule,
            MatDatepickerModule,
            MatProgressBarModule,
            MatProgressSpinnerModule,
            MatToolbarModule,
            MatIconModule,
            MatTabsModule,
            MatFormFieldModule,
            MatButtonModule,
            MatPaginatorModule
        ], FlexLayoutModule,
        ReactiveFormsModule,
        FormsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatTableModule,
        MatTreeModule,
        MatIconModule,
        MatSortModule,
        MatButtonToggleModule,
        MatTooltipModule,
        MatGridListModule,
        MatRadioModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatMenuModule,
        MatDialogModule,
        MatSnackBarModule,
        MatListModule,
        MatStepperModule,
        MatChipsModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        MatToolbarModule,
        MatTabsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatProgressBarModule, MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatSidenavModule,
        MatPaginatorModule,
        CdkTableModule,
        MatNativeDateModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(OpenAMTMaterialModule, { declarations: [AreYouSureDialogComponent, PowerUpAlertComponent, DialogContentComponent], imports: [FlexLayoutModule,
        ReactiveFormsModule,
        FormsModule,
        MatNativeDateModule,
        MatTableModule,
        MatTreeModule,
        MatMenuModule,
        CdkTableModule,
        MatButtonToggleModule,
        MatRadioModule,
        MatSortModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatGridListModule,
        MatChipsModule,
        MatSelectModule,
        MatListModule,
        MatCardModule,
        MatAutocompleteModule,
        MatStepperModule,
        MatDialogModule,
        MatSidenavModule,
        MatInputModule,
        MatSlideToggleModule,
        MatDatepickerModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatIconModule,
        MatTabsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatPaginatorModule], exports: [FlexLayoutModule,
        ReactiveFormsModule,
        FormsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatTableModule,
        MatTreeModule,
        MatIconModule,
        MatSortModule,
        MatButtonToggleModule,
        MatTooltipModule,
        MatGridListModule,
        MatRadioModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatMenuModule,
        MatDialogModule,
        MatSnackBarModule,
        MatListModule,
        MatStepperModule,
        MatChipsModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        MatToolbarModule,
        MatTabsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatProgressBarModule, MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatSidenavModule,
        MatPaginatorModule,
        CdkTableModule,
        MatNativeDateModule] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(OpenAMTMaterialModule, [{
        type: NgModule,
        args: [{
                imports: [
                    FlexLayoutModule,
                    ReactiveFormsModule,
                    FormsModule,
                    MatNativeDateModule,
                    MatTableModule,
                    MatTreeModule,
                    MatMenuModule,
                    CdkTableModule,
                    MatButtonToggleModule,
                    MatRadioModule,
                    MatSortModule,
                    MatCheckboxModule,
                    MatTooltipModule,
                    MatSnackBarModule,
                    MatExpansionModule,
                    MatGridListModule,
                    MatChipsModule,
                    MatSelectModule,
                    MatListModule,
                    MatCardModule,
                    MatAutocompleteModule,
                    MatStepperModule,
                    MatDialogModule,
                    MatSidenavModule,
                    MatInputModule,
                    MatSlideToggleModule,
                    MatDatepickerModule,
                    MatProgressBarModule,
                    MatProgressSpinnerModule,
                    MatToolbarModule,
                    MatIconModule,
                    MatTabsModule,
                    MatFormFieldModule,
                    MatButtonModule,
                    MatPaginatorModule
                ],
                exports: [
                    FlexLayoutModule,
                    ReactiveFormsModule,
                    FormsModule,
                    MatAutocompleteModule,
                    MatDatepickerModule,
                    MatTableModule,
                    MatTreeModule,
                    MatIconModule,
                    MatSortModule,
                    MatButtonToggleModule,
                    MatTooltipModule,
                    MatGridListModule,
                    MatRadioModule,
                    MatCheckboxModule,
                    MatExpansionModule,
                    MatMenuModule,
                    MatDialogModule,
                    MatSnackBarModule,
                    MatListModule,
                    MatStepperModule,
                    MatChipsModule,
                    MatCardModule,
                    MatSelectModule,
                    MatInputModule,
                    MatToolbarModule,
                    MatTabsModule,
                    MatFormFieldModule,
                    MatButtonModule,
                    MatProgressBarModule, MatProgressSpinnerModule,
                    MatSlideToggleModule,
                    MatSidenavModule,
                    MatPaginatorModule,
                    CdkTableModule,
                    MatNativeDateModule
                ],
                providers: [
                    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 30000, panelClass: ['success', 'mat-elevation-z12'] } }
                ],
                declarations: [AreYouSureDialogComponent, PowerUpAlertComponent, DialogContentComponent]
            }]
    }], null, null); })();
class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}
SharedModule.ɵfac = function SharedModule_Factory(t) { return new (t || SharedModule)(); };
SharedModule.ɵmod = ɵɵdefineNgModule({ type: SharedModule });
SharedModule.ɵinj = ɵɵdefineInjector({ imports: [[
            CommonModule,
            OpenAMTMaterialModule
        ], OpenAMTMaterialModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(SharedModule, { imports: [CommonModule, OpenAMTMaterialModule], exports: [OpenAMTMaterialModule] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(SharedModule, [{
        type: NgModule,
        args: [{
                declarations: [],
                exports: [OpenAMTMaterialModule],
                imports: [
                    CommonModule,
                    OpenAMTMaterialModule
                ]
            }]
    }], null, null); })();

class AuthorizeInterceptor {
    constructor(params, dialog) {
        this.params = params;
        this.dialog = dialog;
    }
    intercept(request, next) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.params.authToken}`,
            },
        });
        return next.handle(request).pipe(tap((data) => {
            if (data instanceof HttpResponse) {
                return data;
            }
            return null;
        }, (error) => {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) {
                    this.dialog.open(DialogContentComponent, {
                        data: { name: 'session time out. Please login again' },
                    });
                }
            }
            return throwError(error);
        }));
    }
}
AuthorizeInterceptor.ɵfac = function AuthorizeInterceptor_Factory(t) { return new (t || AuthorizeInterceptor)(ɵɵinject('userInput'), ɵɵinject(MatDialog)); };
AuthorizeInterceptor.ɵprov = ɵɵdefineInjectable({ token: AuthorizeInterceptor, factory: AuthorizeInterceptor.ɵfac });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(AuthorizeInterceptor, [{
        type: Injectable
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: ['userInput']
            }] }, { type: MatDialog }]; }, null); })();

class KvmModule {
    static forRoot(param) {
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
    }
}
KvmModule.ɵfac = function KvmModule_Factory(t) { return new (t || KvmModule)(); };
KvmModule.ɵmod = ɵɵdefineNgModule({ type: KvmModule });
KvmModule.ɵinj = ɵɵdefineInjector({ providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthorizeInterceptor,
            multi: true,
        },
    ], imports: [[
            HttpClientModule,
            FlexLayoutModule,
            BrowserModule,
            SharedModule.forRoot(),
            BrowserAnimationsModule,
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(KvmModule, { declarations: [KvmComponent, DeviceToolbarComponent], imports: [HttpClientModule,
        FlexLayoutModule,
        BrowserModule, SharedModule, BrowserAnimationsModule], exports: [KvmComponent] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(KvmModule, [{
        type: NgModule,
        args: [{
                declarations: [KvmComponent, DeviceToolbarComponent],
                imports: [
                    HttpClientModule,
                    FlexLayoutModule,
                    BrowserModule,
                    SharedModule.forRoot(),
                    BrowserAnimationsModule,
                ],
                exports: [KvmComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [
                    {
                        provide: HTTP_INTERCEPTORS,
                        useClass: AuthorizeInterceptor,
                        multi: true,
                    },
                ],
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
