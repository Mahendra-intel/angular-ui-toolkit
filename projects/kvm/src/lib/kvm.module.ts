import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { KvmComponent } from './kvm.component';
import { DeviceToolbarComponent } from './app/device-toolbar/device-toolbar.component';

@NgModule({
  declarations: [KvmComponent, DeviceToolbarComponent],
  imports: [],
  exports: [KvmComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class KvmModule {}
