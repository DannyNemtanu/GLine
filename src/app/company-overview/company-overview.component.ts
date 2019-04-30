import { AngularFirestore } from '@angular/fire/firestore';
import { UserDataService } from './../services/user-data.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-company-overview',
  templateUrl: './company-overview.component.html',
  styleUrls: ['./company-overview.component.scss']
})
export class CompanyOverviewComponent implements OnInit {
  retailer: boolean;
  isLoaded = false;
  cInfo: any;
  currentYear = new Date().getFullYear();
  yearsInBusiness: any;
  constructor(
    private userService: UserDataService,
    private afs: AngularFirestore
  ) {}
  ngOnInit() {
    this.userData(this.userService.getUserID());
  }
  userData(id) {
    const doc = this.afs.doc(`users/${id}`);
    if (this.userService.setUserType()) {
      this.retailer = true;
    } else {
      this.retailer = false;
    }
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
}
