import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  AuthService
} from '../../../services/auth.service';
import {
  UserDataService
} from './../../../services/user-data.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  User
} from '../../../services/user';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  Router
} from '@angular/router';
import {
  BehaviorSubject
} from 'rxjs';

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
  isNewSearch: BehaviorSubject < boolean > = new BehaviorSubject < boolean > (false);

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
    public router: Router
  ) {}

  ngOnInit() {
    this.searhGroup = this.fb.group({
      type: ['Product', Validators.required],
      search: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9-"', ]*$/)])]
    });
    try {
      this.setUserType();
    } catch (e) {
      throw new Error('Could not set user type!');
    }
    this.id = this.userService.getUserID();
  }
  setUserType() {
    // @reference https://firebase.google.com/docs/firestore/query-data/queries
    const query = this.afs
      .collection < User > ('users', ref =>
        ref.where('uid', '==', this.userService.getUserID())
      )
      .valueChanges();
    try {
      query.subscribe((snapshot: any) => {
        if (snapshot[0].retailer) {
          return this.retailer = true;
        } else {
          return this.manufacturer = true;
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  searchQuery() {
    const type = this.searhGroup.get('type').value;
    const query = this.searhGroup.get('search').value;
    // console.log(this.searhGroup.value);
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
    try {
      this.as.SignOut();
    } catch {
      throw new Error('Secure sign out failed!');
    }
  }
}
