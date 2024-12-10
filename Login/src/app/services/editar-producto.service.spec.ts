import { TestBed } from '@angular/core/testing';

import { EditarProductoService } from './editar-producto.service';

describe('EditarProductoService', () => {
  let service: EditarProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditarProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
