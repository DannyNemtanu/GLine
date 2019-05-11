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
import {
  Observable
} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userCollection: AngularFirestoreCollection < User > ;
  user$: Observable < User[] > ;
  currentUser: Observable < User[] > ;
  user: any;
  check: boolean;
  constructor(
    public afs: AngularFirestore // Inject Firestore service
  ) {}

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
    query.subscribe(snapshot => {
      if (snapshot[0].retailer === true) {
        return true;
      } else {
        return false;
      }
    });
  }
}
