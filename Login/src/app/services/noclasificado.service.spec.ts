import { TestBed } from '@angular/core/testing';

import { NoclasificadoService } from './noclasificado.service';

describe('NoclasificadoService', () => {
  let service: NoclasificadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoclasificadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
