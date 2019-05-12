import {
  ChatService
} from './../../shared/directives/chat.service';
import {
  MessengerComponent
} from './../../messenger/messenger.component';
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
import { reference } from '@angular/core/src/render3';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  isLoaded = true;
  allRequests: Array < any > = [];

  constructor(
    private afs: AngularFirestore,
    private us: UserDataService,
    private router: Router,
    private chat: ChatService
  ) {}

  ngOnInit() {
    this.displayRequests();
  }

  displayRequests() {
    // @reference https://firebase.google.com/docs/firestore/query-data/queries
    const retailerRef = this.afs.collection('users', ref => ref.where('retailer', '==', true)).get();
    retailerRef.forEach(retailer => {
      retailer.docs.forEach(r => {
        const rfqref = this.afs.collection(`${r.ref.path}/rfq`).get();
        rfqref.forEach(rfqList => {
          rfqList.docs.forEach((item) => {
            // console.log(item.ref.path);
            this.afs.doc(item.ref.path).valueChanges().subscribe(rfqData => {
              this.allRequests.push(rfqData);
              // console.log(this.allRequests);
            });
          });
        });
      });
    }).then(() => {
      this.isLoaded = true;
    });
  }
  contactRetailer(id) {
    // Data
    const currentUser = this.us.getUserID();
    const data = {
      receiver: id,
      createdAt: Date.now(),
      chatId: currentUser + id
    };
    const retailer = {
      receiver: currentUser,
      createdAt: Date.now(),
      chatId: currentUser + id
    };

    // Init Connections
    this.afs.collection(`users/${currentUser}/connections`, ref => ref.where('receiver', '==', `${id}`))
      .valueChanges().subscribe(doc => {
        if (doc.length === 0) {
          this.afs.collection(`users/${currentUser}/connections`).add(data).then(() => {
            this.afs.collection(`users/${id}/connections`).add(retailer).then(() => {
              this.chat.setSource(currentUser, id);
              this.router.navigate(['messenger', currentUser + id]);
            });
          });
        } else {
          this.chat.setSource(currentUser, id);
          this.router.navigate(['messenger', currentUser + id]);
        }
      });
    event.stopPropagation();
  }

}
