import { UserDataService } from './../services/user-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-overview',
  templateUrl: './company-overview.component.html',
  styleUrls: ['./company-overview.component.scss']
})
export class CompanyOverviewComponent implements OnInit {
  retailer = true;
  constructor(private userService: UserDataService) {}

  ngOnInit() {
    if (this.userService.setUserType()) {
      this.retailer = true;
    } else {
      this.retailer = false;
    }
  }
}
