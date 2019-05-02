import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../../services/auth.service';
import { UserDataService } from './../../../services/user-data.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../services/user';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  retailer = false;
  manufacturer = false;
  user;
  type;
  id;
  constructor(
    private userService: UserDataService,
    private as: AuthService,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.setUserType();
    this.id = this.userService.getUserID();
  }
  setUserType() {
    const query = this.afs
      .collection<User>('users', ref =>
        ref.where('uid', '==', this.userService.getUserID())
      )
      .valueChanges();
    query.subscribe(snapshot => {
      if (snapshot[0].retailer) {
        this.retailer = true;
      } else {
        this.manufacturer = true;
      }
    });
  }

  logout() {
    this.as.SignOut();
  }
}
