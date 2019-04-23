import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  toogleManufacturer = false;
  toogleRetailer = false;
  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() { }

  retailer() {
    this.toogleRetailer = !this.toogleRetailer;
  }
  manufacturer() {
    this.toogleManufacturer = !this.toogleManufacturer;
  }

  tryRegister(displayName, email, pass, cpass) {
    if (pass === cpass) {
      this.authService.SignUp(displayName, email, pass, this.toogleManufacturer, this.toogleRetailer);
    } else {
      alert('The password did not match');
    }
  }
}
