import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ConsoleLogger,
  IDataProcessor,
  ILogger,
  KeyBoardHelper,
  MouseHelper,
} from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';
// import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'amt-kvm',
  templateUrl: './kvm.component.html',
  styles: [],
})
export class KvmComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef | undefined;
  public context!: CanvasRenderingContext2D;

  // //setting a width and height for the canvas

  @Input() public width = 400;
  @Input() public height = 400;
  @Output() deviceState: number = 0;
  @Output() deviceStatus: EventEmitter<number> = new EventEmitter<number>();
  stopSocketSubscription!: Subscription;
  startSocketSubscription!: Subscription;
  module: any;
  redirector: any;
  dataProcessor!: IDataProcessor | null;
  mouseHelper!: MouseHelper;
  keyboardHelper!: KeyBoardHelper;
  logger!: ILogger;
  powerState: any = 0;
  btnText: string = 'Disconnect';
  isPoweredOn: boolean = false;
  isLoading: boolean = false;
  deviceId: string = '';
  selected: number = 1;
  timeInterval!: any;
  server: string = `${environment.mpsServer.replace('http', 'ws')}/relay`;
  previousAction = 'kvm';
  selectedAction = '';
  mouseMove: any = null;

  encodings = [
    { value: 1, viewValue: 'RLE 8' },
    { value: 2, viewValue: 'RLE 16' },
  ];

  constructor() {
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

  ngOnInit(): void {
    this.logger = new ConsoleLogger(1)
  }

  ngDoCheck(): void {
    if (this.selectedAction !== this.previousAction) {
      this.previousAction = this.selectedAction;
    }
  }

  onMouseup(event: MouseEvent): void {
    if (this.mouseHelper != null) {
      this.mouseHelper.mouseup(event)
    }
  }

  onMousedown(event: MouseEvent): void {
    if (this.mouseHelper != null) {
      this.mouseHelper.mousedown(event)
    }
  }
}
