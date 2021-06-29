import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  ModuleWithProviders,
  Injectable,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { KvmComponent } from './kvm.component';
import { DeviceToolbarComponent } from './app/device-toolbar/device-toolbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth.service';
import { KvmService } from './kvm.service';
import { SharedModule } from './shared/shared.module';
import { AuthorizeInterceptor } from './authorize.interceptor';
@NgModule({
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
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizeInterceptor,
      multi: true,
    },
  ],
})
export class KvmModule {
  public static forRoot(param: any): ModuleWithProviders<KvmModule> {
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
