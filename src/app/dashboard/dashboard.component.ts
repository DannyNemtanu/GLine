import {
  UserDataService
} from './../services/user-data.service';
import {
  AuthService
} from './../shared/services/auth.service';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import {
  Observable
} from 'rxjs';
import {
  User
} from 'firebase';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  usersCollection: AngularFirestoreCollection <User> ;
  users: Observable <User[]> ;
  user: any;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private uService: UserDataService
  ) {}

  ngOnInit() {
    // this.getCurrentUser().then(res => this.displayConsole());
  }

  //  RETRIEVE INDIVIDUAL DOCUMENT HERE
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      this.usersCollection = this.afs.collection('users');
      this.users = this.usersCollection.valueChanges();
      const userUID = this.uService.getUserID();
      this.usersCollection.doc(`${userUID}`).ref.get().then((doc) => {
        this.user = doc.data();
        resolve();
      });
    });
  }
}
