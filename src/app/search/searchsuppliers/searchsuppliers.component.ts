import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  AngularFirestore
} from '@angular/fire/firestore';

@Component({
  selector: 'app-searchsuppliers',
  templateUrl: './searchsuppliers.component.html',
  styleUrls: ['./searchsuppliers.component.scss']
})
export class SearchsuppliersComponent implements OnInit {
  sid: Array < {
    id: string
  } > = [];
  suppliers: Array < any > = [];
  isLoaded = false;
  query: string;
  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.query = params['query'];
    });
    this.displaySuppliers(this.query);
  }
  displaySuppliers(query) {
    let current, prev = null;
    const transform = query.toLowerCase();
    const queryArray = transform.split(' ');

    const supplierRef = this.afs.collection('users', ref => ref.where('manufacturer', '==', true));
    supplierRef.get().forEach(supplier => {
      supplier.docs.forEach(d => {
        this.afs.doc(`${d.ref.path}`).valueChanges().subscribe(data => {
          const value = (data.companyProfile.mainProducts).toLowerCase();
          // Checking Tags
          current = d.ref.id;
          for (let i = 0; i < queryArray.length; i++) {
            if (value.includes(queryArray[i]) && (current !== prev)) {
              prev = d.ref.id;
              this.sid.push({
                id: d.ref.id
              });
              this.suppliers.push(data);
              this.isLoaded = true;
              // console.log(this.sid);
              // console.log(this.suppliers);
            }
          }
        });
      });
    });
  }
}
