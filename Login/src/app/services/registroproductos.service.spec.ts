import { TestBed } from '@angular/core/testing';

import { RegistroproductosService } from './registroproductos.service';

describe('RegistroproductosService', () => {
  let service: RegistroproductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroproductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
