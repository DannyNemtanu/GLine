import { UserDataService } from './../services/user-data.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  isLoaded = false;
  sid: Array<{id: string}> = [];
  pid: Array<{id: string}> = [];
  supplier: Array<any> = [];
  products: Array<any> = [];
  constructor(
    private us: UserDataService,
    private afs: AngularFirestore
  ) {
    const supplierRef = this.afs.collection('users', ref => ref.where('manufacturer', '==', true)).get();
    supplierRef.forEach(supplier => {
      supplier.docs.forEach(d => {
        const prodRef = this.afs.collection(`${d.ref.path}/products`).get();
        prodRef.forEach(products => {
          products.docs.forEach(item => {
            this.sid.push({id: d.id});
            this.pid.push({id: item.id});
            this.afs.doc(`${d.ref.path}`).valueChanges().subscribe(sup => {
              this.supplier.push(sup);
            });
            this.afs.doc(`${item.ref.path}`).valueChanges().subscribe(data => {
              this.products.push(data);
            });
          });
        });
      });
    }).then(() => {
      this.isLoaded = true;
      console.log(this.products);
      console.log(this.supplier);
      console.log(this.pid);
      console.log(this.sid);
    });
    // this.afs.collection(`${supplierRef}/products`).valueChanges().subscribe(data => {
    //   console.log(data);
    // });
  }

  ngOnInit() {
  }

}
