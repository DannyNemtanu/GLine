import {
  UserDataService
} from './../services/user-data.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  AngularFirestore
} from '@angular/fire/firestore';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  year = new Date().getFullYear();
  isLoaded = false;
  sid: Array < {
    id: string
  } > = [];
  pid: Array < {
    id: string
  } > = [];
  date: Array < any > = [];
  supplier: Array < any > = [];
  products: Array < any > = [];
  constructor(
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    // @reference https://firebase.google.com/docs/firestore/query-data/queries
    const supplierRef = this.afs.collection('users', ref => ref.where('manufacturer', '==', true)).get();
    supplierRef.forEach(supplier => {
      supplier.docs.forEach(d => {
        const prodRef = this.afs.collection(`${d.ref.path}/products`).get();
        prodRef.forEach(products => {
          products.docs.forEach(item => {
            this.sid.push({
              id: d.id
            });
            this.pid.push({
              id: item.id
            });
            this.afs.doc(`${d.ref.path}`).valueChanges().subscribe((sup: any) => {
              this.supplier.push(sup);
              const differenceYear = this.year - sup.companyProfile.currentYear;
              if (sup.companyProfile.currentYear === this.year) {
                this.date.push(1);
              } else {
                this.date.push(differenceYear);
              }
            });
            this.afs.doc(`${item.ref.path}`).valueChanges().subscribe(data => {
              this.products.push(data);
            });
          });
        });
      });
    }).then(() => {
      this.isLoaded = true;
    });
  }

}
