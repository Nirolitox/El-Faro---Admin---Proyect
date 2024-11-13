import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionUserPage } from './seleccion-user.page';

describe('SeleccionUserPage', () => {
  let component: SeleccionUserPage;
  let fixture: ComponentFixture<SeleccionUserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SeleccionUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
