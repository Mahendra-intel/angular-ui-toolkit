import { Component, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { ConsoleLogger, } from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { environment } from '../environments/environment';
import * as i0 from "@angular/core";
const _c0 = ["canvas"];
// import { ActivatedRoute, Router } from '@angular/router';
export class KvmComponent {
    constructor() {
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
        console.log('comming inside with new bundle files');
        if (environment.mpsServer.includes('/mps')) {
            //handles kong route
            this.server = `${environment.mpsServer.replace('http', 'ws')}/ws/relay`;
        }
    }
    // ngOnDestroy(): void {
    //   throw new Error('Method not implemented.');
    // }
    // ngAfterViewInit(): void {
    //   throw new Error('Method not implemented.');
    // }
    ngOnInit() {
        this.logger = new ConsoleLogger(1);
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
KvmComponent.ɵfac = function KvmComponent_Factory(t) { return new (t || KvmComponent)(); };
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
    }], function () { return []; }, { canvas: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ZtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2t2bS9zcmMvbGliL2t2bS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9rdm0vc3JjL2xpYi9rdm0uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLGFBQWEsR0FLZCxNQUFNLHlDQUF5QyxDQUFDO0FBQ2pELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7O0FBRTFELDREQUE0RDtBQU81RCxNQUFNLE9BQU8sWUFBWTtJQW1DdkI7UUEvQkEsOENBQThDO1FBRTlCLFVBQUssR0FBRyxHQUFHLENBQUM7UUFDWixXQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ25CLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLGlCQUFZLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFTMUUsZUFBVSxHQUFRLENBQUMsQ0FBQztRQUNwQixZQUFPLEdBQVcsWUFBWSxDQUFDO1FBQy9CLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUN0QixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBRXJCLFdBQU0sR0FBVyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3hFLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLG1CQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLGNBQVMsR0FBUSxJQUFJLENBQUM7UUFFdEIsY0FBUyxHQUFHO1lBQ1YsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUU7WUFDaEMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUU7U0FDbEMsQ0FBQztRQUdBLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFDLG9CQUFvQjtZQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDekU7SUFDSCxDQUFDO0lBQ0Qsd0JBQXdCO0lBQ3hCLGdEQUFnRDtJQUNoRCxJQUFJO0lBQ0osNEJBQTRCO0lBQzVCLGdEQUFnRDtJQUNoRCxJQUFJO0lBRUosUUFBUTtRQUNOLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDcEMsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUMvQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDM0M7SUFDSCxDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQWlCO1FBQ3pCLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDaEM7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQWlCO1FBQzNCLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDbEM7SUFDSCxDQUFDOzt3RUFyRVUsWUFBWTtpREFBWixZQUFZOzs7Ozs7UUMxQnpCLDJCQUFLO1FBQ0QsaUNBQWdDO1FBQUMseUJBQVE7UUFBQSxpQkFBUztRQUNsRCxvQ0FBOEo7UUFBaEUsbUdBQVcscUJBQWlCLElBQUMsMEZBQWMsdUJBQW1CLElBQWpDO1FBQW1DLGlCQUFTO1FBQzNLLGlCQUFNOztRQUQ2QixlQUFlO1FBQWYsaUNBQWUsc0JBQUE7O3VGRHdCckMsWUFBWTtjQUx4QixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLFdBQVcsRUFBRSxzQkFBc0I7Z0JBQ25DLE1BQU0sRUFBRSxFQUFFO2FBQ1g7c0NBRXlDLE1BQU07a0JBQTdDLFNBQVM7bUJBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUt0QixLQUFLO2tCQUFwQixLQUFLO1lBQ1UsTUFBTTtrQkFBckIsS0FBSztZQUNJLFdBQVc7a0JBQXBCLE1BQU07WUFDRyxZQUFZO2tCQUFyQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ29uc29sZUxvZ2dlcixcbiAgSURhdGFQcm9jZXNzb3IsXG4gIElMb2dnZXIsXG4gIEtleUJvYXJkSGVscGVyLFxuICBNb3VzZUhlbHBlcixcbn0gZnJvbSAnQG9wZW4tYW10LWNsb3VkLXRvb2xraXQvdWktdG9vbGtpdC9jb3JlJztcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuLy8gaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FtdC1rdm0nLFxuICB0ZW1wbGF0ZVVybDogJy4va3ZtLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVzOiBbXSxcbn0pXG5leHBvcnQgY2xhc3MgS3ZtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQFZpZXdDaGlsZCgnY2FudmFzJywgeyBzdGF0aWM6IGZhbHNlIH0pIGNhbnZhczogRWxlbWVudFJlZiB8IHVuZGVmaW5lZDtcbiAgcHVibGljIGNvbnRleHQhOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgLy8gLy9zZXR0aW5nIGEgd2lkdGggYW5kIGhlaWdodCBmb3IgdGhlIGNhbnZhc1xuXG4gIEBJbnB1dCgpIHB1YmxpYyB3aWR0aCA9IDQwMDtcbiAgQElucHV0KCkgcHVibGljIGhlaWdodCA9IDQwMDtcbiAgQE91dHB1dCgpIGRldmljZVN0YXRlOiBudW1iZXIgPSAwO1xuICBAT3V0cHV0KCkgZGV2aWNlU3RhdHVzOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuICBzdG9wU29ja2V0U3Vic2NyaXB0aW9uITogU3Vic2NyaXB0aW9uO1xuICBzdGFydFNvY2tldFN1YnNjcmlwdGlvbiE6IFN1YnNjcmlwdGlvbjtcbiAgbW9kdWxlOiBhbnk7XG4gIHJlZGlyZWN0b3I6IGFueTtcbiAgZGF0YVByb2Nlc3NvciE6IElEYXRhUHJvY2Vzc29yIHwgbnVsbDtcbiAgbW91c2VIZWxwZXIhOiBNb3VzZUhlbHBlcjtcbiAga2V5Ym9hcmRIZWxwZXIhOiBLZXlCb2FyZEhlbHBlcjtcbiAgbG9nZ2VyITogSUxvZ2dlcjtcbiAgcG93ZXJTdGF0ZTogYW55ID0gMDtcbiAgYnRuVGV4dDogc3RyaW5nID0gJ0Rpc2Nvbm5lY3QnO1xuICBpc1Bvd2VyZWRPbjogYm9vbGVhbiA9IGZhbHNlO1xuICBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgZGV2aWNlSWQ6IHN0cmluZyA9ICcnO1xuICBzZWxlY3RlZDogbnVtYmVyID0gMTtcbiAgdGltZUludGVydmFsITogYW55O1xuICBzZXJ2ZXI6IHN0cmluZyA9IGAke2Vudmlyb25tZW50Lm1wc1NlcnZlci5yZXBsYWNlKCdodHRwJywgJ3dzJyl9L3JlbGF5YDtcbiAgcHJldmlvdXNBY3Rpb24gPSAna3ZtJztcbiAgc2VsZWN0ZWRBY3Rpb24gPSAnJztcbiAgbW91c2VNb3ZlOiBhbnkgPSBudWxsO1xuXG4gIGVuY29kaW5ncyA9IFtcbiAgICB7IHZhbHVlOiAxLCB2aWV3VmFsdWU6ICdSTEUgOCcgfSxcbiAgICB7IHZhbHVlOiAyLCB2aWV3VmFsdWU6ICdSTEUgMTYnIH0sXG4gIF07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc29sZS5sb2coJ2NvbW1pbmcgaW5zaWRlIHdpdGggbmV3IGJ1bmRsZSBmaWxlcycpO1xuICAgIGlmIChlbnZpcm9ubWVudC5tcHNTZXJ2ZXIuaW5jbHVkZXMoJy9tcHMnKSkge1xuICAgICAgLy9oYW5kbGVzIGtvbmcgcm91dGVcbiAgICAgIHRoaXMuc2VydmVyID0gYCR7ZW52aXJvbm1lbnQubXBzU2VydmVyLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKX0vd3MvcmVsYXlgO1xuICAgIH1cbiAgfVxuICAvLyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgLy8gICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gIC8vIH1cbiAgLy8gbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAvLyAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgLy8gfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IENvbnNvbGVMb2dnZXIoMSlcbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZEFjdGlvbiAhPT0gdGhpcy5wcmV2aW91c0FjdGlvbikge1xuICAgICAgdGhpcy5wcmV2aW91c0FjdGlvbiA9IHRoaXMuc2VsZWN0ZWRBY3Rpb247XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZXVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMubW91c2VIZWxwZXIgIT0gbnVsbCkge1xuICAgICAgdGhpcy5tb3VzZUhlbHBlci5tb3VzZXVwKGV2ZW50KVxuICAgIH1cbiAgfVxuXG4gIG9uTW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMubW91c2VIZWxwZXIgIT0gbnVsbCkge1xuICAgICAgdGhpcy5tb3VzZUhlbHBlci5tb3VzZWRvd24oZXZlbnQpXG4gICAgfVxuICB9XG59XG4iLCI8IS0tIDxhbXQtZGV2aWNlLXRvb2xiYXI+PC9hbXQtZGV2aWNlLXRvb2xiYXI+IC0tPlxyXG48ZGl2PlxyXG4gICAgPGJ1dHRvbiBzdHlsZT1cImRpc3BsYXk6IGJsb2NrO1wiPiBjb25uZWN0IDwvYnV0dG9uPlxyXG4gICAgPGNhbnZhcyBjbGFzcz1cImNhbnZhc1wiICNjYW52YXMgW3dpZHRoXT1cIndpZHRoXCIgW2hlaWdodF09XCJoZWlnaHRcIiBvbmNvbnRleHRtZW51PVwicmV0dXJuIGZhbHNlXCIgKG1vdXNldXApPVwib25Nb3VzZXVwKCRldmVudClcIiAobW91c2Vkb3duKT1cIm9uTW91c2Vkb3duKCRldmVudClcIj48L2NhbnZhcz5cclxuPC9kaXY+XHJcblxyXG4iXX0=