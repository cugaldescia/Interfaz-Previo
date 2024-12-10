import { TestBed } from '@angular/core/testing';

import { RegistroFPService } from './registro-fp.service';

describe('RegistroFPService', () => {
  let service: RegistroFPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroFPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
