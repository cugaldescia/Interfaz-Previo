import { TestBed } from '@angular/core/testing';

import { ConformidadService } from './conformidad.service';

describe('ConformidadService', () => {
  let service: ConformidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConformidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
