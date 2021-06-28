/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
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
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from '@angular/cdk/table';
import { AreYouSureDialogComponent } from './are-you-sure/are-you-sure.component';
import { PowerUpAlertComponent } from './power-up-alert/power-up-alert.component';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import * as i0 from "@angular/core";
// import { HttpClientModule } from '@angular/common/http'
export class OpenAMTMaterialModule {
}
OpenAMTMaterialModule.ɵfac = function OpenAMTMaterialModule_Factory(t) { return new (t || OpenAMTMaterialModule)(); };
OpenAMTMaterialModule.ɵmod = i0.ɵɵdefineNgModule({ type: OpenAMTMaterialModule });
OpenAMTMaterialModule.ɵinj = i0.ɵɵdefineInjector({ providers: [
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
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(OpenAMTMaterialModule, { declarations: [AreYouSureDialogComponent, PowerUpAlertComponent, DialogContentComponent], imports: [FlexLayoutModule,
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
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(OpenAMTMaterialModule, [{
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
export class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}
SharedModule.ɵfac = function SharedModule_Factory(t) { return new (t || SharedModule)(); };
SharedModule.ɵmod = i0.ɵɵdefineNgModule({ type: SharedModule });
SharedModule.ɵinj = i0.ɵɵdefineInjector({ imports: [[
            CommonModule,
            OpenAMTMaterialModule
        ], OpenAMTMaterialModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SharedModule, { imports: [CommonModule, OpenAMTMaterialModule], exports: [OpenAMTMaterialModule] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SharedModule, [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL3NoYXJlZC9zaGFyZWQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7dUVBR3VFO0FBQ3ZFLDJEQUEyRDtBQUMzRCxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQTtBQUM3RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDOUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDZCQUE2QixDQUFBO0FBQy9ELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFBO0FBQ2hFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBQzVELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQTtBQUN4RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQTtBQUM1RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUE7QUFDeEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ3RELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUMxRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUE7QUFDdEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUE7QUFDaEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ3RELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFBO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBQzVELE9B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KioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKiBDb3B5cmlnaHQgKGMpIEludGVsIENvcnBvcmF0aW9uIDIwMjFcclxuKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXh0cmFuZW91cy1jbGFzcyAqL1xyXG5pbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbidcclxuaW1wb3J0IHsgUmVhY3RpdmVGb3Jtc01vZHVsZSwgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3JtcydcclxuaW1wb3J0IHsgTWF0R3JpZExpc3RNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9ncmlkLWxpc3QnXHJcbmltcG9ydCB7IE1hdEV4cGFuc2lvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2V4cGFuc2lvbidcclxuaW1wb3J0IHsgTWF0U3RlcHBlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3N0ZXBwZXInXHJcbmltcG9ydCB7IE1hdENoaXBzTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2hpcHMnXHJcbmltcG9ydCB7IE1hdE5hdGl2ZURhdGVNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJ1xyXG5pbXBvcnQgeyBNYXRUYWJsZU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RhYmxlJ1xyXG5pbXBvcnQgeyBNYXRDYXJkTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZCdcclxuaW1wb3J0IHsgTWF0RGlhbG9nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJ1xyXG5pbXBvcnQgeyBNYXRMaXN0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGlzdCdcclxuaW1wb3J0IHsgTWF0UGFnaW5hdG9yTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcGFnaW5hdG9yJ1xyXG5pbXBvcnQgeyBNYXRTb3J0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc29ydCdcclxuaW1wb3J0IHsgTWF0Q2hlY2tib3hNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGVja2JveCdcclxuaW1wb3J0IHsgTWF0VG9vbHRpcE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3Rvb2x0aXAnXHJcbmltcG9ydCB7IE1hdEF1dG9jb21wbGV0ZU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2F1dG9jb21wbGV0ZSdcclxuaW1wb3J0IHsgTWF0U25hY2tCYXJNb2R1bGUsIE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc25hY2stYmFyJ1xyXG5pbXBvcnQgeyBNYXRJbnB1dE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2lucHV0J1xyXG5pbXBvcnQgeyBNYXRGb3JtRmllbGRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJ1xyXG5pbXBvcnQgeyBNYXRSYWRpb01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3JhZGlvJ1xyXG5pbXBvcnQgeyBNYXRTZWxlY3RNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zZWxlY3QnXHJcbmltcG9ydCB7IE1hdFNsaWRlVG9nZ2xlTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2xpZGUtdG9nZ2xlJ1xyXG5pbXBvcnQgeyBNYXRQcm9ncmVzc0Jhck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3Byb2dyZXNzLWJhcidcclxuaW1wb3J0IHsgTWF0RGF0ZXBpY2tlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RhdGVwaWNrZXInXHJcbmltcG9ydCB7IE1hdFByb2dyZXNzU3Bpbm5lck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXInXHJcbmltcG9ydCB7IE1hdEljb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJ1xyXG5pbXBvcnQgeyBNYXRUb29sYmFyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdG9vbGJhcidcclxuaW1wb3J0IHsgTWF0U2lkZW5hdk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NpZGVuYXYnXHJcbmltcG9ydCB7IE1hdE1lbnVNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9tZW51J1xyXG5pbXBvcnQgeyBNYXRCdXR0b25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nXHJcbmltcG9ydCB7IE1hdFRhYnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90YWJzJ1xyXG5pbXBvcnQgeyBNYXRUcmVlTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdHJlZSdcclxuaW1wb3J0IHsgTWF0QnV0dG9uVG9nZ2xlTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uLXRvZ2dsZSdcclxuXHJcbi8vIGltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJ1xyXG5pbXBvcnQgeyBGbGV4TGF5b3V0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQnXHJcbmltcG9ydCB7IENka1RhYmxlTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJ1xyXG5pbXBvcnQgeyBBcmVZb3VTdXJlRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi9hcmUteW91LXN1cmUvYXJlLXlvdS1zdXJlLmNvbXBvbmVudCdcclxuaW1wb3J0IHsgUG93ZXJVcEFsZXJ0Q29tcG9uZW50IH0gZnJvbSAnLi9wb3dlci11cC1hbGVydC9wb3dlci11cC1hbGVydC5jb21wb25lbnQnXHJcbmltcG9ydCB7IERpYWxvZ0NvbnRlbnRDb21wb25lbnQgfSBmcm9tICcuL2RpYWxvZy1jb250ZW50L2RpYWxvZy1jb250ZW50LmNvbXBvbmVudCdcclxuLy8gaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJ1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBGbGV4TGF5b3V0TW9kdWxlLFxyXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcclxuICAgIEZvcm1zTW9kdWxlLFxyXG4gICAgTWF0TmF0aXZlRGF0ZU1vZHVsZSxcclxuICAgIE1hdFRhYmxlTW9kdWxlLFxyXG4gICAgTWF0VHJlZU1vZHVsZSxcclxuICAgIE1hdE1lbnVNb2R1bGUsXHJcbiAgICBDZGtUYWJsZU1vZHVsZSxcclxuICAgIE1hdEJ1dHRvblRvZ2dsZU1vZHVsZSxcclxuICAgIE1hdFJhZGlvTW9kdWxlLFxyXG4gICAgTWF0U29ydE1vZHVsZSxcclxuICAgIE1hdENoZWNrYm94TW9kdWxlLFxyXG4gICAgTWF0VG9vbHRpcE1vZHVsZSxcclxuICAgIE1hdFNuYWNrQmFyTW9kdWxlLFxyXG4gICAgTWF0RXhwYW5zaW9uTW9kdWxlLFxyXG4gICAgTWF0R3JpZExpc3RNb2R1bGUsXHJcbiAgICBNYXRDaGlwc01vZHVsZSxcclxuICAgIE1hdFNlbGVjdE1vZHVsZSxcclxuICAgIE1hdExpc3RNb2R1bGUsXHJcbiAgICBNYXRDYXJkTW9kdWxlLFxyXG4gICAgTWF0QXV0b2NvbXBsZXRlTW9kdWxlLFxyXG4gICAgTWF0U3RlcHBlck1vZHVsZSxcclxuICAgIE1hdERpYWxvZ01vZHVsZSxcclxuICAgIE1hdFNpZGVuYXZNb2R1bGUsXHJcbiAgICBNYXRJbnB1dE1vZHVsZSxcclxuICAgIE1hdFNsaWRlVG9nZ2xlTW9kdWxlLFxyXG4gICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcclxuICAgIE1hdFByb2dyZXNzQmFyTW9kdWxlLFxyXG4gICAgTWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlLFxyXG4gICAgTWF0VG9vbGJhck1vZHVsZSxcclxuICAgIE1hdEljb25Nb2R1bGUsXHJcbiAgICBNYXRUYWJzTW9kdWxlLFxyXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxyXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxyXG4gICAgTWF0UGFnaW5hdG9yTW9kdWxlXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBGbGV4TGF5b3V0TW9kdWxlLFxyXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcclxuICAgIEZvcm1zTW9kdWxlLFxyXG4gICAgTWF0QXV0b2NvbXBsZXRlTW9kdWxlLFxyXG4gICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcclxuICAgIE1hdFRhYmxlTW9kdWxlLFxyXG4gICAgTWF0VHJlZU1vZHVsZSxcclxuICAgIE1hdEljb25Nb2R1bGUsXHJcbiAgICBNYXRTb3J0TW9kdWxlLFxyXG4gICAgTWF0QnV0dG9uVG9nZ2xlTW9kdWxlLFxyXG4gICAgTWF0VG9vbHRpcE1vZHVsZSxcclxuICAgIE1hdEdyaWRMaXN0TW9kdWxlLFxyXG4gICAgTWF0UmFkaW9Nb2R1bGUsXHJcbiAgICBNYXRDaGVja2JveE1vZHVsZSxcclxuICAgIE1hdEV4cGFuc2lvbk1vZHVsZSxcclxuICAgIE1hdE1lbnVNb2R1bGUsXHJcbiAgICBNYXREaWFsb2dNb2R1bGUsXHJcbiAgICBNYXRTbmFja0Jhck1vZHVsZSxcclxuICAgIE1hdExpc3RNb2R1bGUsXHJcbiAgICBNYXRTdGVwcGVyTW9kdWxlLFxyXG4gICAgTWF0Q2hpcHNNb2R1bGUsXHJcbiAgICBNYXRDYXJkTW9kdWxlLFxyXG4gICAgTWF0U2VsZWN0TW9kdWxlLFxyXG4gICAgTWF0SW5wdXRNb2R1bGUsXHJcbiAgICBNYXRUb29sYmFyTW9kdWxlLFxyXG4gICAgTWF0VGFic01vZHVsZSxcclxuICAgIE1hdEZvcm1GaWVsZE1vZHVsZSxcclxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcclxuICAgIE1hdFByb2dyZXNzQmFyTW9kdWxlLCBNYXRQcm9ncmVzc1NwaW5uZXJNb2R1bGUsXHJcbiAgICBNYXRTbGlkZVRvZ2dsZU1vZHVsZSxcclxuICAgIE1hdFNpZGVuYXZNb2R1bGUsXHJcbiAgICBNYXRQYWdpbmF0b3JNb2R1bGUsXHJcbiAgICBDZGtUYWJsZU1vZHVsZSxcclxuICAgIE1hdE5hdGl2ZURhdGVNb2R1bGVcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgeyBwcm92aWRlOiBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUywgdXNlVmFsdWU6IHsgZHVyYXRpb246IDMwMDAwLCBwYW5lbENsYXNzOiBbJ3N1Y2Nlc3MnLCAnbWF0LWVsZXZhdGlvbi16MTInXSB9IH1cclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW0FyZVlvdVN1cmVEaWFsb2dDb21wb25lbnQsIFBvd2VyVXBBbGVydENvbXBvbmVudCwgRGlhbG9nQ29udGVudENvbXBvbmVudF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE9wZW5BTVRNYXRlcmlhbE1vZHVsZSB7XHJcblxyXG59XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW10sXHJcbiAgZXhwb3J0czogW09wZW5BTVRNYXRlcmlhbE1vZHVsZV0sXHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgT3BlbkFNVE1hdGVyaWFsTW9kdWxlXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2hhcmVkTW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdCAoKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTaGFyZWRNb2R1bGU+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBTaGFyZWRNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW11cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19