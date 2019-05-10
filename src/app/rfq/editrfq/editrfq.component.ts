import {
  Component,
  OnInit,
  ApplicationRef,
  NgZone
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
import {
  detectChanges
} from '@angular/core/src/render3';
import {
  VirtualTimeScheduler
} from 'rxjs';

@Component({
  selector: 'app-editrfq',
  templateUrl: './editrfq.component.html',
  styleUrls: ['./editrfq.component.scss']
})
export class EditrfqComponent implements OnInit {
  rfqID = new Array();
  allRequests = new Array();
  toDelete = new Array();
  isLoaded = false;
  itemsDeleted = true;
  constructor(
    private afs: AngularFirestore,
    private us: UserDataService,
    private router: Router
  ) {

  }

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
              this.rfqID.push(item.ref.path);
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
  confirmChanges() {
    console.log(this.toDelete.length);
    for (let i = 0; i < this.toDelete.length; i++) {
      this.afs.doc(this.toDelete[i]).delete();
    }
    this.router.navigate(['/dashboard']);
  }
  displayClicked(request, index) {
    console.log(request, index);
  }
  deleteRFQ(request, docRef) {
    const index = this.allRequests.indexOf(request);
    this.allRequests.splice(index, 1);
    this.rfqID.splice(index, 1);
    this.toDelete.push(docRef);
    // console.log(docRef);
    // console.log(this.rfqID);
    // console.log(this.allRequests);
    // console.log(this.toDelete);
  }
}
