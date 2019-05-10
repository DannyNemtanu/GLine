import {
  UserDataService
} from './../../services/user-data.service';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  Injectable
} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import {
  Observable
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecureRetailerGuard implements CanActivate {
  userType: boolean;
  constructor(
    private userData: UserDataService,
    private afs: AngularFirestore,
    public router: Router

  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable < boolean > | Promise < boolean > | boolean {
    const currentUser = this.userData.getUserID();
    this.afs.doc(`users/${currentUser}`).valueChanges().subscribe((user: any) => {
      if (user.retailer) {
        this.router.navigate(['dashboard']);
      } else {
        this.router.navigate(['overview', this.userData.getUserID()]);
      }
    });
    return true;
  }
}
