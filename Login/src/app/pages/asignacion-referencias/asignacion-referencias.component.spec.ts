import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionReferenciasComponent } from './asignacion-referencias.component';

describe('AsignacionReferenciasComponent', () => {
  let component: AsignacionReferenciasComponent;
  let fixture: ComponentFixture<AsignacionReferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionReferenciasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsignacionReferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
