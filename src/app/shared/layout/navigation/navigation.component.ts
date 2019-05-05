import {
  ChatService
} from './../../directives/chat.service';
import {
  ForgotPasswordComponent
} from './../../../authentication/forgot-password/forgot-password.component';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  AuthService
} from './../../services/auth.service';
import {
  UserDataService
} from './../../../services/user-data.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  User
} from '../../services/user';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  Router
} from '@angular/router';

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
  sid;
  cid;
  searhGroup: FormGroup;
  searchType = [{
      id: 1,
      name: 'Product'
    },
    {
      id: 2,
      name: 'Supplier'
    }
  ];
  constructor(
    private userService: UserDataService,
    private as: AuthService,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    public router: Router,
    private chat: ChatService
  ) {}

  ngOnInit() {
    this.searhGroup = this.fb.group({
      type: ['Product', Validators.required],
      search: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9-"', ]*$/)])]
    });
    this.setUserType();
    this.id = this.userService.getUserID();
  }
  goToChat() {
    this.chat.setSource('', this.userService.getUserID());
    this.router.navigate(['messenger', this.userService.getUserID()]);

  }
  setUserType() {
    const query = this.afs
      .collection < User > ('users', ref =>
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
  searchQuery() {
    const type = this.searhGroup.get('type').value;
    const query = this.searhGroup.get('search').value;
    console.log(this.searhGroup.value);
    if (type === 'Product') {
      this.router.navigate(['/products', query]).then(() => {
        if (this.router.url.indexOf('/products/') > -1) {
          window.location.reload();
        }
      });
    } else {
      this.router.navigate(['/suppliers', query]).then(() => {
        if (this.router.url.indexOf('/suppliers/') > -1) {
          window.location.reload();
        }
      });
    }
  }
  logout() {
    this.as.SignOut();
  }
}
