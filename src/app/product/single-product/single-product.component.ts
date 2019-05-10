import { ChatService } from './../../shared/directives/chat.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserDataService } from 'src/app/services/user-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit {
  product: any;
  id;
  pid;
  isLoaded = false;
  mainImage = '';
  constructor(
    private userService: UserDataService,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private chat: ChatService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pid = params['id'];
      this.id = params['user'];
      this.getPrduct(this.id, this.pid);
    });
  }
  getPrduct(id, pid) {
    //  const product = this.afs.doc(`users/${id}`);
    const doc = this.afs
      .doc(`users/${id}/products/${pid}`)
      .valueChanges();
    doc.subscribe(data => {
      this.product = data;
      this.isLoaded = true;
      this.mainImage = this.product.productImages[0].productImage;
      // console.log(this.product);
    });
  }
  changeImage(event, url) {
    this.mainImage = url;
  }
  contactSupplier() {
    // Data
    const clientId = this.userService.getUserID();
    const data = {
      receiver: this.id,
      createdAt: Date.now(),
      chatId: this.id + clientId
    };
    const supplier = {
      receiver: clientId,
      createdAt: Date.now(),
      chatId: this.id + clientId
    };
    // Init Connections
    this.afs.collection(`users/${clientId}/connections`, ref => ref.where('receiver', '==', `${this.id}`))
      .valueChanges().subscribe(doc => {
        if (doc.length === 0) {
          this.afs.collection(`users/${clientId}/connections`).add(data).then(() => {
            this.afs.collection(`users/${this.id}/connections`).add(supplier).then(() => {
              this.chat.setSource(this.id, clientId);
              this.router.navigate(['messenger', this.id + clientId]);
            });
          });
        } else {
          this.chat.setSource(this.id, clientId);
          this.router.navigate(['messenger', this.id + clientId]);
        }
      });
    event.stopPropagation();
  }
}
