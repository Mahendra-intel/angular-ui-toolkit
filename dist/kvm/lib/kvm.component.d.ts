import { ElementRef, EventEmitter, OnInit } from '@angular/core';
import { IDataProcessor, ILogger, KeyBoardHelper, MouseHelper } from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
export declare class KvmComponent implements OnInit {
    canvas: ElementRef | undefined;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    deviceState: number;
    deviceStatus: EventEmitter<number>;
    stopSocketSubscription: Subscription;
    startSocketSubscription: Subscription;
    module: any;
    redirector: any;
    dataProcessor: IDataProcessor | null;
    mouseHelper: MouseHelper;
    keyboardHelper: KeyBoardHelper;
    logger: ILogger;
    powerState: any;
    btnText: string;
    isPoweredOn: boolean;
    isLoading: boolean;
    deviceId: string;
    selected: number;
    timeInterval: any;
    server: string;
    previousAction: string;
    selectedAction: string;
    mouseMove: any;
    encodings: {
        value: number;
        viewValue: string;
    }[];
    constructor();
    ngOnInit(): void;
    ngDoCheck(): void;
    onMouseup(event: MouseEvent): void;
    onMousedown(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDef<KvmComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<KvmComponent, "amt-kvm", never, { "width": "width"; "height": "height"; }, { "deviceState": "deviceState"; "deviceStatus": "deviceStatus"; }, never, never>;
}
//# sourceMappingURL=kvm.component.d.ts.map