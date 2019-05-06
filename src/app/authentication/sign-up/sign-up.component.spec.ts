import {
  CompleteProfileComponent
} from './../../company-overview/complete-profile/complete-profile.component';
import {
  VerifyEmailComponent
} from './../verify-email/verify-email.component';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync
} from '@angular/core/testing';

import {
  SignUpComponent
} from './sign-up.component';
import {
  RouterTestingModule
} from '@angular/router/testing';
import {
  ReactiveFormsModule
} from '@angular/forms';
import {
  AuthService
} from 'src/app/shared/services/auth.service';
import {
  FakeauthService
} from 'src/app/shared/services/fakeauth.service';
import { Router } from '@angular/router';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture < SignUpComponent > ;
  let app;
  let router: Router;
  beforeEach(async (() => {
    TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([{
          path: 'verify-email-address',
          component: VerifyEmailComponent
        }]), ReactiveFormsModule],
        providers: [{
          provide: AuthService,
          useClass: FakeauthService
        }],
        declarations: [SignUpComponent, VerifyEmailComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    app = fixture.debugElement.componentInstance;
    router = TestBed.get(Router);
    router.initialNavigation();
  });
  it('should show sign up', fakeAsync(() => {
    expect(app).toBeTruthy();
  }));

  it('before register submit - validation', () => {
    spyOn(router, 'navigate').and.returnValue(true);
    component.registerForm.patchValue({
      regUsername: 'GRetailer',
      regEmail: 'danix826@gmail.com',
      manufacturer: false,
      retailer: true,
      regPassword: 'GoodPassword1234.',
      regcPass: 'GoodPassword1234.',
    });
    component.tryRegister();
    expect(router.navigate).toHaveBeenCalledWith(['verify-email-address']);
  });
});
