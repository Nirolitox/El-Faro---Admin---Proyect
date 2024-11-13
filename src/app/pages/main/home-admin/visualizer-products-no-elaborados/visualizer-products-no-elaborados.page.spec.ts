import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizerProductsNoElaboradosPage } from './visualizer-products-no-elaborados.page';

describe('VisualizerProductsNoElaboradosPage', () => {
  let component: VisualizerProductsNoElaboradosPage;
  let fixture: ComponentFixture<VisualizerProductsNoElaboradosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VisualizerProductsNoElaboradosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
