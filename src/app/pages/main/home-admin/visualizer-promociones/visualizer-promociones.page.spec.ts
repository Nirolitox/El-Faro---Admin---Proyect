import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizerPromocionesPage } from './visualizer-promociones.page';

describe('VisualizerPromocionesPage', () => {
  let component: VisualizerPromocionesPage;
  let fixture: ComponentFixture<VisualizerPromocionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VisualizerPromocionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
