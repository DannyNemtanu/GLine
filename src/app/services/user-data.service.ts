import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  User
} from './../shared/services/user';
import {
  Injectable
} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userCollection: AngularFirestoreCollection < User > ;
  user$: any;
  currentUser: any;
  user: any;
  check: boolean;
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    private auth: AngularFireAuth
  ) {
    // this.user$ = this.auth.authState.subscribe(user => {
    //   if (user) {
    //     this.afs.doc(`users/${user.uid}`).valueChanges().subscribe(cuser => {
    //       this.type.currentUser = cuser;
    //     });
    //   } else {
    //     return null;
    //   }
    // });
  }

  public get currentUserValue(): User {
    this.user = this.user$.subscribe(user => {
      return user;
    });
    return this.user;
  }
  getUserID() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.uid;
  }

  setUserType() {
    const query = this.afs
      .collection < User > ('users', ref =>
        ref.where('uid', '==', this.getUserID())
      )
      .valueChanges();
    query.subscribe((snapshot: any) => {
      if (snapshot[0].retailer === true) {
        return true;
      } else {
        return false;
      }
    });
  }
}
