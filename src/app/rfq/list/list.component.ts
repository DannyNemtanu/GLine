import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  UserDataService
} from 'src/app/services/user-data.service';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  isLoaded = false;
  allRequests: Array < any > = [];

  constructor(
    private afs: AngularFirestore,
    private us: UserDataService,
    private router: Router

  ) {}

  ngOnInit() {
    this.displayRequests();
  }

  displayRequests() {
    const retailerRef = this.afs.collection('users', ref => ref.where('retailer', '==', true)).get();
    retailerRef.forEach(retailer => {
      retailer.docs.forEach(r => {
        const rfqref = this.afs.collection(`${r.ref.path}/rfq`).get();
        rfqref.forEach(rfqList => {
          rfqList.docs.forEach((item) => {
            console.log(item.ref.path);
            this.afs.doc(item.ref.path).valueChanges().subscribe(rfqData => {
              this.allRequests.push(rfqData);
              console.log(this.allRequests);
            });
          });
        });
      });
    }).then(() => {
      this.isLoaded = true;
    });
  }

  contactRetailer(id) {
    const currentUser = this.us.getUserID();
    this.router.navigate(['messenger', currentUser + id]);
  }

}
