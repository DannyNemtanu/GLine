import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserDataService } from './../services/user-data.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../shared/services/user';
@Component({
  selector: 'app-company-overview',
  templateUrl: './company-overview.component.html',
  styleUrls: ['./company-overview.component.scss']
})
export class CompanyOverviewComponent implements OnInit {
  retailer: boolean;
  isLoaded = false;
  id;
  cInfo: any;
  currentYear = new Date().getFullYear();
  yearsInBusiness: any;
  constructor(
    private userService: UserDataService,
    private afs: AngularFirestore,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getInfo(this.id);
    });
    this.setUserType();
    // this.userData(this.userService.getUserID());
  }
  getInfo(id) {
    const doc = this.afs.doc(`users/${id}`);
    doc.valueChanges().subscribe(data => {
      this.cInfo = data.companyProfile;
      const years = this.currentYear - data.companyProfile.currentYear;
      if (years == 0) {
        this.yearsInBusiness = 1;
      } else {
        this.yearsInBusiness = years;
      }
      this.isLoaded = true;
    });
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
        this.retailer = false;
      }
    });
  }
}
