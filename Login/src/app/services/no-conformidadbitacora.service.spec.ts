import { TestBed } from '@angular/core/testing';

import { NoConformidadbitacoraService } from './no-conformidadbitacora.service';

describe('NoConformidadbitacoraService', () => {
  let service: NoConformidadbitacoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoConformidadbitacoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
