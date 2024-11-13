import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeccionEspecialPage } from './seccion-especial.page';

describe('SeccionEspecialPage', () => {
  let component: SeccionEspecialPage;
  let fixture: ComponentFixture<SeccionEspecialPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SeccionEspecialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
