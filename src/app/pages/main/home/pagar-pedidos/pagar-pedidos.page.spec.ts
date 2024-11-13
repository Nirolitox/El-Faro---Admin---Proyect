import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagarPedidosPage } from './pagar-pedidos.page';

describe('PagarPedidosPage', () => {
  let component: PagarPedidosPage;
  let fixture: ComponentFixture<PagarPedidosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PagarPedidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
