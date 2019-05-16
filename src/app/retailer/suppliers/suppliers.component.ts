import {
  ChatService
} from '../../services/chat.service';
import {
  UserDataService
} from 'src/app/services/user-data.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  currentYear: Array < any > = [];
  isLoaded = false;
  suppliers: Array < any > = [];
  sid;
  cid;
  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private us: UserDataService,
    private chat: ChatService
  ) {}

  ngOnInit() {
    const currentDate = new Date().getFullYear();
    // @reference https://firebase.google.com/docs/firestore/query-data/queries
    const supplierRef = this.afs.collection('users', ref =>
      ref.where('manufacturer', '==', true)
    );
    supplierRef.valueChanges().subscribe((data: any) => {
      data.forEach(supplier => {
        this.suppliers.push(supplier);
        let yearDifference = currentDate - supplier.companyProfile.currentYear;
        console.log(yearDifference);
        if (supplier.companyProfile.currentYear === currentDate) {
          yearDifference = 1;
          this.currentYear.push(yearDifference);
        } else {
          this.currentYear.push(yearDifference);
        }
        // console.log(this.suppliers);
        this.isLoaded = true;
      });
    });
  }
  checkSupplier(event, id) {
    this.router.navigate(['overview', id]);
  }

  contactSupplier(event, supplierId) {
    // Data
    const clientId = this.us.getUserID();
    const chatId = supplierId + clientId;
    const data = {
      receiver: supplierId,
      createdAt: Date.now(),
      chatId: chatId
    };
    const supplier = {
      receiver: clientId,
      createdAt: Date.now(),
      chatId: supplierId + clientId
    };
    // Init Connections
    this.afs.collection(`users/${clientId}/connections`, ref => ref.where('receiver', '==', `${supplierId}`))
      .valueChanges().subscribe(doc => {
        if (doc.length === 0) {
          this.afs.collection(`users/${clientId}/connections`).add(data).then(() => {
            this.afs.collection(`users/${supplierId}/connections`).add(supplier).then(() => {
              this.checkChat(chatId, supplierId, clientId);
            });
          });
        } else {
          this.router.navigate(['messenger', supplierId + clientId]);
        }
      });
    event.stopPropagation();
  }

  checkChat(chatid, supplierId, clientId) {
    try {
      this.afs.doc(`chats/${chatid}`).valueChanges().subscribe(data => {
        if (data) {
          this.router.navigate(['messenger', supplierId + clientId]);
        } else {
          this.create(chatid, supplierId, clientId);
        }
      });
    } catch (e) {
      throw new Error(`Chat could not be found: ${chatid} by the`);
    }
  }

  async create(chatid, supplierID, clientID) {
    const data = {
      sid: supplierID,
      cid: clientID,
      createdAt: Date.now(),
      chatID: chatid
    };
    const mockMessage = {
      uid: clientID,
      createdAt: Date.now(),
      content: ''
    };
    this.afs.doc(`chats/${chatid}`).set(data).then(() => {
      this.afs.collection(`chats/${chatid}/messages`).add(mockMessage).then(() => {
        this.router.navigate(['messenger', supplierID + clientID]);
      });
    });
  }
}
