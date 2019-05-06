import {
  ChatService
} from 'src/app/shared/directives/chat.service';
import {
  Location
} from '@angular/common';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync
} from '@angular/core/testing';

import {
  NavigationComponent
} from './navigation.component';
import {
  RouterTestingModule
} from '@angular/router/testing';
import {
  ReactiveFormsModule
} from '@angular/forms';
import {
  Router
} from '@angular/router';
import {
  AuthService
} from '../../services/auth.service';
import {
  FakeauthService
} from '../../services/fakeauth.service';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  UserDataService
} from 'src/app/services/user-data.service';
import {
  from
} from 'rxjs';
import {
  SignInComponent
} from 'src/app/authentication/sign-in/sign-in.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture < NavigationComponent > ;
  let router: Router;
  let location: Location;
  let app;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([{
          path: 'sign-in',
          component: SignInComponent
        }]), ReactiveFormsModule],
        providers: [{
            provide: AuthService,
            useClass: FakeauthService
          },
          {
            provide: UserDataService,
            useClass: FakeauthService
          },
          {
            provide: AngularFirestore,
            useClass: FakeauthService
          },
          {
            provide: ChatService,
            useClass: FakeauthService
          }
        ],
        declarations: [NavigationComponent, SignInComponent]
      })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
        app = fixture.debugElement.componentInstance;
        location = TestBed.get(Location);
        router = TestBed.get(Router);
        router.initialNavigation();
      });
  }));
  it('should show navigation if user type is set', () => {
    if (component.retailer || component.manufacturer) {
      expect(app).toBeTruthy();
    }
  });
  it('should clear local storage when loged out', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(true);
    component.logout();
    expect(localStorage.getItem('user')).toBe(null);
  }));
});
