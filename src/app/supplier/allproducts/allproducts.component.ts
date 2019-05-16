import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-allproducts',
  templateUrl: './allproducts.component.html',
  styleUrls: ['./allproducts.component.scss']
})
export class AllproductsComponent implements OnInit {
  pid$;
  tasks: Observable<any[]>;
  isLoaded = false;
  products: Array<string> = [];
  allProducts: any;
  cUser;
  docId: any;
  path;
  productEdit = false;
  editStatus = false;
  constructor(
    private userService: UserDataService,
    private afs: AngularFirestore
  ) {
    this.cUser = this.userService.getUserID();
    this.path = '/product/' + this.cUser;
    this.getPrducts(this.userService.getUserID());
  }

  ngOnInit() {}

  getPrducts(id) {
    const collectionRef = this.afs.collection(`users/${id}/products`);
    collectionRef.get().subscribe(d => {
      d.forEach(doc => {
        this.products.push(doc.id);
      });
      // console.log(this.products);
    });
    collectionRef.valueChanges().subscribe(data => {
      this.allProducts = data;
    });
    this.isLoaded = true;
  }
}
