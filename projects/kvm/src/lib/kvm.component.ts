import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AMTDesktop,
  AMTKvmDataRedirector,
  ConsoleLogger,
  DataProcessor,
  IDataProcessor,
  ILogger,
  KeyBoardHelper,
  MouseHelper,
  Protocol,
} from '@open-amt-cloud-toolkit/ui-toolkit/core';
import { environment } from '../environments/environment';
import { KvmService } from './kvm.service';
import { fromEvent, interval, of, Subscription, timer } from 'rxjs';
import { catchError, finalize, mergeMap, throttleTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { PowerUpAlertComponent } from './shared/power-up-alert/power-up-alert.component';
import SnackbarDefaults from './shared/config/snackBarDefault';

@Component({
  selector: 'amt-kvm',
  templateUrl: './kvm.component.html',
  styles: [],
})
export class KvmComponent implements OnInit, AfterViewInit, OnDestroy {
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

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly devicesService: KvmService,
    @Inject('userInput') public params // public readonly activatedRoute: ActivatedRoute
  ) {
    this.deviceId = this.params.deviceId;
    if (environment.mpsServer.includes('/mps')) {
      //handles kong route
      this.server = `${environment.mpsServer.replace('http', 'ws')}/ws/relay`;
    }
  }

  ngOnInit(): void {
    this.logger = new ConsoleLogger(1);
    // this.activatedRoute.params.subscribe((params) => {
    //   this.isLoading = true;
    //   this.deviceId = params.id;
    // });
    this.stopSocketSubscription = this.devicesService.stopwebSocket.subscribe(
      () => {
        this.stopKvm();
      }
    );
    this.startSocketSubscription =
      this.devicesService.connectKVMSocket.subscribe(() => {
        this.setAmtFeatures();
      });
    this.timeInterval = interval(15000)
      .pipe(mergeMap(() => this.devicesService.getPowerState(this.deviceId)))
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.setAmtFeatures();
  }

  instantiate(): void {
    this.context = this.canvas?.nativeElement.getContext('2d');
    this.redirector = new AMTKvmDataRedirector(
      this.logger,
      Protocol.KVM,
      new FileReader(),
      this.deviceId,
      16994,
      '',
      '',
      0,
      0,
      this.authService.getLoggedUserToken(),
      this.server
    );
    this.module = new AMTDesktop(this.logger as any, this.context);
    this.dataProcessor = new DataProcessor(
      this.logger,
      this.redirector,
      this.module
    );
    this.mouseHelper = new MouseHelper(this.module, this.redirector, 200);
    this.keyboardHelper = new KeyBoardHelper(this.module, this.redirector);

    this.redirector.onProcessData = this.module.processData.bind(this.module);
    this.redirector.onStart = this.module.start.bind(this.module);
    this.redirector.onNewState = this.module.onStateChange.bind(this.module);
    this.redirector.onSendKvmData = this.module.onSendKvmData.bind(this.module);
    this.redirector.onStateChanged = this.onConnectionStateChange.bind(this);
    this.redirector.onError = this.onRedirectorError.bind(this);
    this.module.onSend = this.redirector.send.bind(this.redirector);
    this.module.onProcessData = this.dataProcessor.processData.bind(
      this.dataProcessor
    );
    this.module.bpp = this.selected;
    this.mouseMove = fromEvent(this.canvas?.nativeElement, 'mousemove');
    this.mouseMove.pipe(throttleTime(200)).subscribe((event: any) => {
      if (this.mouseHelper != null) {
        this.mouseHelper.mousemove(event);
      }
    });
  }

  onConnectionStateChange = (redirector: any, state: number): any => {
    this.deviceState = state;
    this.deviceStatus.emit(state);
  };

  onRedirectorError(): void {
    this.reset();
  }

  init(): void {
    this.devicesService
      .getPowerState(this.deviceId)
      .pipe(
        catchError(() => {
          this.snackBar.open(
            `Error retrieving power status`,
            undefined,
            SnackbarDefaults.defaultError
          );
          return of();
        }),
        finalize(() => {})
      )
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
        } else {
          this.instantiate();
          setTimeout(() => {
            this.isLoading = false;
            this.autoConnect();
          }, 0);
        }
      });
  }

  setAmtFeatures(): void {
    this.isLoading = true;
    this.devicesService
      .setAmtFeatures(this.deviceId)
      .pipe(
        catchError(() => {
          this.snackBar.open(
            `Error enabling kvm`,
            undefined,
            SnackbarDefaults.defaultError
          );
          this.init();
          return of();
        }),
        finalize(() => {})
      )
      .subscribe(() => this.init());
  }

  autoConnect(): void {
    if (this.redirector != null) {
      this.redirector.start(WebSocket);
      this.keyboardHelper.GrabKeyInput();
    }
  }

  onEncodingChange(): void {
    this.stopKvm();
    timer(1000).subscribe(() => {
      this.autoConnect();
    });
  }

  checkPowerStatus(): boolean {
    return this.powerState.powerstate === 2;
  }

  reset = (): void => {
    this.redirector = null;
    this.module = null;
    this.dataProcessor = null;
    this.height = 400;
    this.width = 400;
    this.instantiate();
  };

  stopKvm = (): void => {
    this.redirector.stop();
    this.keyboardHelper.UnGrabKeyInput();
    this.reset();
  };

  ngDoCheck(): void {
    if (this.selectedAction !== this.previousAction) {
      this.previousAction = this.selectedAction;
    }
  }

  onMouseup(event: MouseEvent): void {
    if (this.mouseHelper != null) {
      this.mouseHelper.mouseup(event);
    }
  }

  onMousedown(event: MouseEvent): void {
    if (this.mouseHelper != null) {
      this.mouseHelper.mousedown(event);
    }
  }

  ngOnDestroy(): void {
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
