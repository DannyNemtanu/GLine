import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserDataService } from 'src/app/services/user-data.service';
import { ActivatedRoute } from '@angular/router';

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
  constructor(
    private userService: UserDataService,
    private afs: AngularFirestore,
    private route: ActivatedRoute
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
      console.log(this.product);
    });

  }
}
