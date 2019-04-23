import { AuthService } from './../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
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
  constructor(
    private userService: UserDataService,
    private afs: AngularFirestore,
    private as: AuthService
  ) {}

  ngOnInit() {
    const id = this.userService.getUserID();
    this.checkUser();
  }
  private checkUser() {
    console.log(this.userService.setUserType());
    if (this.userService.setUserType()) {
      this.retailer = true;
    } else {
      this.manufacturer = true;
    }
  }
}
