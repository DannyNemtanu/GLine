import {
  ChatService
} from './../shared/directives/chat.service';
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
    const supplierRef = this.afs.collection('users', ref =>
      ref.where('manufacturer', '==', true)
    );
    supplierRef.valueChanges().subscribe(data => {
      data.forEach(supplier => {
        this.suppliers.push(supplier);
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
    const data = {
      receiver: supplierId,
      createdAt: Date.now(),
      chatId: supplierId + clientId
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
              this.chat.setSource(supplierId, clientId);
              this.router.navigate(['messenger', supplierId + clientId]);
            });
          });
        } else {
          this.chat.setSource(supplierId, clientId);
          this.router.navigate(['messenger', supplierId + clientId]);
        }
      });
    event.stopPropagation();
  }
}
