import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizerProductsPage } from './visualizer-products.page';

describe('VisualizerProductsPage', () => {
  let component: VisualizerProductsPage;
  let fixture: ComponentFixture<VisualizerProductsPage>;

  beforeEach((() => {
    fixture = TestBed.createComponent(VisualizerProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
