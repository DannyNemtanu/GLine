import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  Location
} from '@angular/common';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  CompanyOverviewComponent
} from './company-overview.component';
import {
  NavigationComponent
} from '../navigation/navigation.component';
import {
  ReactiveFormsModule
} from '@angular/forms';
import {
  RouterTestingModule
} from '@angular/router/testing';
import {
  Router
} from '@angular/router';
import {
  FakeauthService
} from '../../../services/fakeauth.service';
import {
  UserDataService
} from '../../../services/user-data.service';
import {
  ChatService
} from '../../../services/chat.service';
import {
  AuthService
} from '../../../services/auth.service';

const doc: any = {
  displayName: 'GRetailer',
  email: 'danix826@gmail.com',
  emailVerified: true,
  manufacturer: false,
  retailer: true,
  uid: 'cNYSRvCSXGaNNn6EwczjmQaz6Z53',
  password: 'GoodPassword1234.',
  cpass: 'GoodPassword1234.'
};

// const collectionStub = {
//   valueChanges: jasmine.createSpy('valueChanges').and.returnValue(doc)
// };
// // const docStub = {
// //   doc: jasmine.createSpy('doc').and.returnValue(collectionStub)
// // };

// const angularFirestoreStub = {
//   collection: jasmine.createSpy('doc').and.returnValue(collectionStub)
// };

describe('CompanyOverviewComponent', () => {
  // let afs: AngularFirestore;
  let component: CompanyOverviewComponent;
  let fixture: ComponentFixture < CompanyOverviewComponent > ;
  let router: Router;
  let location: Location;
  let app;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([{
          path: 'overview/:id',
          component: CompanyOverviewComponent
        }])],
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
        declarations: [CompanyOverviewComponent, NavigationComponent]
      })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(CompanyOverviewComponent);
        component = fixture.componentInstance;
        // afs = TestBed.get(AngularFirestore);
        location = TestBed.get(Location);
        router = TestBed.get(Router);
        router.initialNavigation();
        app = fixture.debugElement.componentInstance;
      });
  }));

  it('gathering user id', fakeAsync(() => {
    spyOn(router, 'navigated');
    const id = 'cNYSRvCSXGaNNn6EwczjmQaz6Z53';
    router.navigate(['overview', id]);
    tick();
    expect(location.path()).toBe(`/overview/${id}`);
  }));

});
