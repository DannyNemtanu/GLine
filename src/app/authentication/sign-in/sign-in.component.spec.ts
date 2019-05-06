import {
  Location
} from '@angular/common';
import {
  HomeComponent
} from './../../dashboard/home/home.component';
import {
  AppComponent
} from './../../app.component';
import {
  NavigationComponent
} from './../../shared/layout/navigation/navigation.component';
import {
  DashboardComponent
} from './../../dashboard/dashboard.component';
import {
  FakeauthService
} from './../../shared/services/fakeauth.service';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  SignInComponent
} from './sign-in.component';
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
  CompanyOverviewComponent
} from 'src/app/company-overview/company-overview.component';
import {
  Router
} from '@angular/router';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';


describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture < SignInComponent > ;
  let router: Router;
  let location: Location;
  let app;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([{
            path: 'overview/:id',
            component: CompanyOverviewComponent
          },
          {
            path: 'dashboard',
            component: DashboardComponent
          },
          {
            path: 'verify-email-address',
            component: VerifyEmailComponent
          },
        ]), ReactiveFormsModule],
        providers: [{
          provide: AuthService,
          useClass: FakeauthService
        }],
        declarations:
        [HomeComponent, SignInComponent, CompanyOverviewComponent, DashboardComponent, NavigationComponent, VerifyEmailComponent]
      })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(SignInComponent);
        component = fixture.componentInstance;
        app = fixture.debugElement.componentInstance;
        location = TestBed.get(Location);
        router = TestBed.get(Router);
        router.initialNavigation();
      });
  }));
  it('should show sign in if the user is not logged in', () => {
    if (localStorage.getItem('user') == null) {
      expect(app).toBeTruthy();
    }
  });

  it('should redirect to dashboard on submit', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(true);
    component.loginForm.patchValue({
      userName: 'danix826@gmail.com',
      userPassword: 'danielo26'
    });
    component.tryLogin();
    expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
  }));
});
