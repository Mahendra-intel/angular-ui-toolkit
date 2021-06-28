import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KvmComponent } from './kvm.component';
import { DeviceToolbarComponent } from './app/device-toolbar/device-toolbar.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { KvmService } from './kvm.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [KvmComponent, DeviceToolbarComponent],
  imports: [HttpClientModule, BrowserModule,SharedModule.forRoot()],
  exports: [KvmComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService, KvmService],
})
export class KvmModule {}
