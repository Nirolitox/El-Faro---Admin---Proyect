import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddUpdateTasaDolarComponent } from './add-update-tasa-dolar.component';

describe('AddUpdateTasaDolarComponent', () => {
  let component: AddUpdateTasaDolarComponent;
  let fixture: ComponentFixture<AddUpdateTasaDolarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateTasaDolarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateTasaDolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
