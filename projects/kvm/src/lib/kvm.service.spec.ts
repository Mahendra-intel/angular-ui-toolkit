import { TestBed } from '@angular/core/testing';

import { KvmService } from './kvm.service';

describe('KvmService', () => {
  let service: KvmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KvmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
