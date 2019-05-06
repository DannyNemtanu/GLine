import {
  Injectable
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FakeauthService {

  mockUser = {
    displayName: 'GRetailer',
    email: 'danix826@gmail.com',
    emailVerified: true,
    manufacturer: false,
    retailer: true,
    uid: 'cNYSRvCSXGaNNn6EwczjmQaz6Z53',
    password: 'GoodPassword1234.',
    cpass: 'GoodPassword1234.',
  };
  userCollection = [{
    displayName: 'GRetailer',
    email: 'danix826@gmail.com',
    emailVerified: true,
    manufacturer: false,
    retailer: true,
    uid: 'cNYSRvCSXGaNNn6EwczjmQaz6Z53',
    password: 'GoodPassword1234.',
    cpass: 'GoodPassword1234.',
  }];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  // Sign in with email/password
  SignIn(email, password) {
    if (email === this.mockUser.email) {
      if (this.mockUser.manufacturer === true) {
        return this.router.navigate(['overview', this.mockUser.uid]);
      } else if (this.mockUser.emailVerified === false) {
        return this.router.navigate(['verify-email-address']);
      } else {
        return this.router.navigate(['dashboard']);
      }
    }
  }
  getUserID() {
    return this.mockUser.uid;
  }

  SignUp(displayName, email, password, manufactuerer, retailer) {
    const user: any = {
      uid: this.mockUser.uid,
      email: this.mockUser.email,
      manufacturer: manufactuerer,
      retailer: retailer,
      displayName: displayName,
      emailVerified: this.mockUser.emailVerified
    };
    localStorage.setItem('user', user);
    if (localStorage.getItem('user') !== null) {
      return this.router.navigate(['verify-email-address']);
    }
  }

  // Navigation
  SignOut() {
    localStorage.removeItem('user');
    if (localStorage.getItem('user') !== null) {
      return this.router.navigate(['sign-in']);
    }
  }
}
