import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  public constructor(private authService: AuthService, public afAuth: AngularFireAuth) {}
  ngOnInit() {
  }
}

