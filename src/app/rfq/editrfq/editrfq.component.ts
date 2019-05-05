import {
  Component,
  OnInit
} from '@angular/core';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  UserDataService
} from 'src/app/services/user-data.service';
import {
  Router
} from '@angular/router';
import {
  ThrowStmt
} from '@angular/compiler';

@Component({
  selector: 'app-editrfq',
  templateUrl: './editrfq.component.html',
  styleUrls: ['./editrfq.component.scss']
})
export class EditrfqComponent implements OnInit {
  rfqID: Array < any > = [];
  allRequests: Array < any > = [];
  isLoaded = false;

  constructor(
    private afs: AngularFirestore,
    private us: UserDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.displayRequests(this.us.getUserID());
  }
  displayRequests(id) {
    const retailerRef = this.afs.collection('users', ref => ref.where('retailer', '==', true).where('uid', '==', id)).get();
    retailerRef.forEach(retailer => {
      retailer.docs.forEach(r => {
        const rfqref = this.afs.collection(`${r.ref.path}/rfq`).get();
        rfqref.forEach(rfqList => {
          rfqList.docs.forEach((item) => {
            console.log(item.ref.path);
            this.afs.doc(item.ref.path).valueChanges().subscribe(rfqData => {
              this.rfqID.push(item.id);
              this.allRequests.push(rfqData);
              console.log(this.allRequests);
              console.log(this.rfqID);
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
  deleteRFQ(id) {
    const currentUser = this.us.getUserID();
    this.afs.doc(`users/${currentUser}/rfq/${id}`).delete().then(() => {
      this.displayRequests(currentUser);
    });
  }
}
