import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  AuthService
} from '../../services/auth.service';
import {
  Component,
  OnInit
} from '@angular/core';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  toogleManufacturer = false;
  toogleRetailer = false;
  registerForm: FormGroup;
  constructor(
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      manufacturer: [
        false,
      ],
      retailer: [
        false,
      ],
      regUsername: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9-"'+, ]*$/),
        ])
      ],
      regEmail: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email
        ])
      ],
      regPassword: [
        '',
        Validators.compose([
          Validators.required,
          // tslint:disable-next-line:max-line-length
          // 10 to 32 character password requiring at least 3 out 4 (uppercase and lowercase letters, numbers and special characters) and no more than 2 equal characters in a row
          Validators.minLength(10),
          // tslint:disable-next-line:max-line-length
          Validators.pattern(/^(?:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))(?!.*(.)\1{2,})[A-Za-z0-9!~<>,;:_=?*+#."&§%°()\|\[\]\-\$\^\@\/]{10,32}$/)
        ])
      ],
      regcPass: [
        '',
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  ngOnInit() {}

  retailer() {
    this.toogleRetailer = !this.toogleRetailer;
    if (this.toogleManufacturer === true) {
      this.toogleManufacturer = false;
    }
    this.registerForm.patchValue({
      retailer: this.toogleRetailer,
      manufacturer: this.toogleManufacturer
    });
  }
  manufacturer() {
    this.toogleManufacturer = !this.toogleManufacturer;
    if (this.toogleRetailer === true) {
      this.toogleRetailer = false;
    }
    this.registerForm.patchValue({
      retailer: this.toogleRetailer,
      manufacturer: this.toogleManufacturer
    });
  }

  tryRegister() {
    const displayName = this.registerForm.get('regUsername').value;
    const email = this.registerForm.get('regEmail').value;
    const pass = this.registerForm.get('regPassword').value;
    const cpass = this.registerForm.get('regcPass').value;
    const manufacturer = this.registerForm.get('manufacturer').value;
    const retailer = this.registerForm.get('retailer').value;

    if (manufacturer === false && retailer === false) {
      alert('Select one type Manufacturer or Retailer');
    } else {
      if (pass === cpass) {
        return this.authService.SignUp(displayName, email, pass, manufacturer, retailer);
      } else {
        alert('The password did not match');
      }
    }
  }
}
