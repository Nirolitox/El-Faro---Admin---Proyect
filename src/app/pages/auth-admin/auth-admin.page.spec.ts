import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthAdminPage } from './auth-admin.page';

describe('AuthAdminPage', () => {
  let component: AuthAdminPage;
  let fixture: ComponentFixture<AuthAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AuthAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
