import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroFacturasComponent } from './registro-facturas.component';

describe('RegistroFacturasComponent', () => {
  let component: RegistroFacturasComponent;
  let fixture: ComponentFixture<RegistroFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroFacturasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
