import { User } from './../shared/services/user';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  CollectionReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userCollection: AngularFirestoreCollection<User>;
  user$: Observable<User[]>;
  currentUser: Observable<User[]>;
  user: any;
  check: boolean;
  constructor(
    public afs: AngularFirestore // Inject Firestore service
  ) {}

  getUserID() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.uid;
  }
  setUserType(): boolean {
    const query = this.afs
      .collection<User>('users', ref =>
        ref.where('uid', '==', this.getUserID())
      )
      .valueChanges();
    query.subscribe(snapshot => {
      if (snapshot[0].retailer) {
        this.check = true;
      } else {
        this.check = false;
      }
    });
    return this.check;
  }

  getCurrentUser() {
    let user = null;
    const query = this.afs
      .collection('users', ref => ref.where('uid', '==', this.getUserID()))
      .valueChanges();
    query.subscribe(snapshot => {
      user = snapshot[0];
      return user;
    });
  }
}
