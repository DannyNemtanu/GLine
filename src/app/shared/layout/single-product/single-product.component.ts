import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
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
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  ChatService
} from 'src/app/services/chat.service';

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
  calculator: Array < any > = [];
  oPrice: Array < any > = [];
  tPrice = 0;
  tP = 0;
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
    doc.subscribe((data: any) => {
      this.product = data;
      this.isLoaded = true;
      this.mainImage = this.product.productImages[0].productImage;
      this.initVariants();
    });
  }
  totalPrice() {
    this.oPrice = this.product.orderPrices;
    this.tP = 0;
    this.tPrice = 0;
    for (let i = 0; i < this.calculator.length; i++) {
      this.tP += +this.calculator[i];
    }
    for (let i = 0; i < this.oPrice.length; i++) {
      if (this.tP >= this.oPrice[i].qmin && this.tP <= this.oPrice[i].qmax) {
        this.tPrice = this.tP * (+this.oPrice[i].qprice);
      }
      if (this.tP >= this.oPrice[i].qmin && '' === this.oPrice[i].qmax) {
        this.tPrice = this.tP * (+this.oPrice[i].qprice);
      }
    }
  }
  initVariants() {
    const _variants: Array < any > = this.product.variants;
    // console.log(_variants);
    for (let i = 0; i < _variants.length; i++) {
      this.calculator.push(0);
    }
    // console.log(this.calculator);
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
