import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizerRecetasPage } from './visualizer-recetas.page';

describe('VisualizerRecetasPage', () => {
  let component: VisualizerRecetasPage;
  let fixture: ComponentFixture<VisualizerRecetasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VisualizerRecetasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
