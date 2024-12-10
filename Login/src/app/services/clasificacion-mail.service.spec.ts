import { TestBed } from '@angular/core/testing';

import { ClasificacionMailService } from './clasificacion-mail.service';

describe('ClasificacionMailService', () => {
  let service: ClasificacionMailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasificacionMailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
