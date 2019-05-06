import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  AuthService
} from './../../shared/services/auth.service';
import {
  Component,
  OnInit
} from '@angular/core';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  auth;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      userName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/),
        ])
      ],
      userPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9-"'+, ]*$/)
        ])
      ]
    });
  }
  ngOnInit() {}
  tryLogin() {
    const email = this.loginForm.get('userName').value;
    const password = this.loginForm.get('userPassword').value;
    return this.authService.SignIn(email, password);
  }
}
