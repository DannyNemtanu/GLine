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
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  userError;
  loginForm: FormGroup;
  auth;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private sanitize: DomSanitizer
  ) {
    this.loginForm = this.fb.group({
      userName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email
        ])
      ],
      userPassword: [
        '',
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }
  ngOnInit() {}
  tryLogin() {
    const email = this.loginForm.get('userName').value;
    const password = this.loginForm.get('userPassword').value;
    try {
      return this.authService.SignIn(email, password);
    } catch {
      this.userError = true;
    }
  }
}
