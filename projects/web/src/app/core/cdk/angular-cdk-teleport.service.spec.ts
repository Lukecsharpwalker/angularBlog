import { TestBed } from '@angular/core/testing';

import { AngularCdkTeleportService } from './angular-cdk-teleport.service';

describe('AngularCdkTeleportService', () => {
  let service: AngularCdkTeleportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularCdkTeleportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
