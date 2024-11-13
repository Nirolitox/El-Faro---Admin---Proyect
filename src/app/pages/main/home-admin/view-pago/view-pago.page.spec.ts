import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewPagoPage } from './view-pago.page';

describe('ViewPagoPage', () => {
  let component: ViewPagoPage;
  let fixture: ComponentFixture<ViewPagoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
