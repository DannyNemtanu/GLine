import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  ActivatedRoute
} from '@angular/router';
import {
  Component,
  OnInit,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';


@Component({
  selector: 'app-searchproducts',
  templateUrl: './searchproducts.component.html',
  styleUrls: ['./searchproducts.component.scss']
})
export class SearchproductsComponent implements OnInit {
  sid: Array < {
    id: string
  } > = [];
  pid: Array < {
    id: string
  } > = [];
  supplier: Array < any > = [];
  products: Array < any > = [];
  isLoaded = false;
  query: string;
  setLastQuer: string;
  newSearch = false;
  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private cdr: ChangeDetectorRef
  ) {
    this.route.params.subscribe(params => {
      this.query = params['query'];
    });
  }

  ngOnInit() {
    this.displayProducts(this.query);
  }
  displayProducts(query) {
    let current, prev = null;
    const transform = query.toLowerCase();
    const queryArray = transform.split(' ');
    const supplierRef = this.afs.collection('users', ref => ref.where('manufacturer', '==', true)).get();
    supplierRef.forEach(supplier => {
      supplier.docs.forEach(d => {
        const prodRef = this.afs.collection(`${d.ref.path}/products`).get();
        prodRef.forEach(products => {
          products.docs.forEach((item, index) => {
            this.afs.doc(`${d.ref.path}`).valueChanges().subscribe(sup => {
              this.supplier.push(sup);
            });
            this.afs.doc(`${item.ref.path}`).valueChanges().subscribe((product: any) => {
              const value = product.tags;
              // Checking Tags
              current = item.ref.id;
              for (let i = 0; i < queryArray.length; i++) {
                if (value.includes(queryArray[i]) && (current !== prev)) {
                  prev = item.ref.id;
                  this.sid.push({
                    id: d.ref.id
                  });
                  this.pid.push({
                    id: item.id
                  });
                  this.products.push(product);
                }
              }
            });
          });
        });
      });
    }).then(() => {
      this.isLoaded = true;
      // console.log(this.sid);
      // console.log(this.pid);
      // console.log(this.products);
    });
  }
}
