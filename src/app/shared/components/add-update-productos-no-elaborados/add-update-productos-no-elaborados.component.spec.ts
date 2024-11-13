import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddUpdateProductosNoElaboradosComponent } from './add-update-productos-no-elaborados.component';

describe('AddUpdateProductosNoElaboradosComponent', () => {
  let component: AddUpdateProductosNoElaboradosComponent;
  let fixture: ComponentFixture<AddUpdateProductosNoElaboradosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateProductosNoElaboradosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateProductosNoElaboradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
