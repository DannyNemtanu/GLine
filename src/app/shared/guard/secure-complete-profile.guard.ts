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
import {
  AngularFirestore
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SecureCompleteProfileGuard implements CanActivate {
  currentUser: any;
  checkUser: any;
  user: any;
  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) {}
  getCurrentuser() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    return new Promise < any > ((resolve, reject) => {
      let user = this.afs.doc(`users/${currentUser.uid}`).valueChanges().subscribe((user: any) => {
        if (user.completedProfile) {
          resolve(user);
        } else {
          reject('No completed profile');
        }
      });
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise < boolean > {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    return new Promise((resolve, reject) => {
      this.getCurrentuser()
        .then(user => {
          return resolve(true);
        }, err => {
          this.router.navigate(['/complete-profile']);
          return resolve(false);
        });
    });
  }
}
