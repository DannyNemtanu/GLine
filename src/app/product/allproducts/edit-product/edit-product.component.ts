import { UserDataService } from './../../../services/user-data.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import {
  AngularFireUploadTask,
  AngularFireStorage
} from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  // AngularFirestore
  task: AngularFireUploadTask;
  snapshot: Observable<any>;
  // Initializing form
  ProductForm: FormGroup;
  imageCounter = 0;
  imageError = false;
  pid;
  id;
  product: any;
  productValidation = {
    // Step One
    title: [
      { type: 'required', message: 'Title is required!' },
      {
        type: 'minlength',
        message: 'Minimum 5 characters'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    description: [
      { type: 'required', message: 'Description is required!' },
      {
        type: 'minlength',
        message: 'Minimum 30 characters'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    type: [
      { type: 'required', message: 'Type is required!' },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    brand: [
      { type: 'required', message: 'Brand is required!' },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    collection: [
      { type: 'required', message: 'Collection is required!' },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    tags: [
      { type: 'required', message: 'Tags are required!' },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    pricingmin: [
      { type: 'required', message: 'Min is required!' },
      {
        type: 'pattern',
        message:
          'Please make sure you use safe characters! \n The number is valid !'
      }
    ],
    pricingmax: [
      { type: 'required', message: 'Max is required!' },
      {
        type: 'pattern',
        message:
          'Please make sure you use safe characters! \n The number is valid !'
      }
    ],
    qmin: [
      { type: 'required', message: 'Min is required!' },
      {
        type: 'pattern',
        message:
          'Please make sure you use safe characters! \n The number is valid !'
      }
    ],
    qmax: [
      { type: 'required', message: 'Max is required!' },
      {
        type: 'pattern',
        message:
          'Please make sure you use safe characters! \n The number is valid !'
      }
    ],
    weight: [
      {
        type: 'pattern',
        message:
          'Please make sure you use safe characters! \n The number is valid !'
      }
    ],
    origin: [
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    productImage: [
      {
        type: 'pattern',
        message: 'File not supported!'
      }
    ],
    supplyAbility: [
      {
        type: 'pattern',
        message: 'Please include allowed characters!'
      },
      {
        type: 'required',
        message: 'Supply Required!'
      }
    ],
    optionName: [
      {
        type: 'pattern',
        message: 'Please include allowed characters!'
      },
      {
        type: 'required',
        message: 'Required!'
      }
    ],
    optionValue: [
      {
        type: 'pattern',
        message: 'Please include allowed characters!'
      },
      {
        type: 'required',
        message: 'Required!'
      }
    ]
  };
  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private us: UserDataService,
    private afStorage: AngularFireStorage,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.ProductForm = this.fb.group({
      title: [
        'Sample Product',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^[a-zA-Z0-9-"', ]*$/)
        ])
      ],
      overview: this.fb.array([]),
      pd: this.fb.array([]),
      supplyAbility: [
        '1200 piece per Month',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9, ]*$/)
        ])
      ],
      type: [
        'Electronic, mobile, phone, consumers',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9, ]*$/)
        ])
      ],
      brand: [
        'Collasion',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9, ]*$/)
        ])
      ],
      collection: [
        'Mobile Phone, Electronics',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9, ]*$/)
        ])
      ],
      tags: [
        'electronics, mobile, phone, consumer',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9, ]*$/)
        ])
      ],
      digital: [false],
      weight: ['0.850', Validators.compose([Validators.pattern(/^[0-9.]*$/)])],
      origin: [
        'Romania',
        Validators.compose([Validators.pattern(/^[a-zA-Z0-9-,. ]*$/)])
      ],
      variants: this.fb.array([]),
      orderPrices: this.fb.array([]),
      productImages: this.fb.array([]),
      uid: ['']
    });
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pid = params['id'];
      this.id = params['user'];
      this.getPrduct(this.id, this.pid);
    });
  }
  // Getting Product Data
  getPrduct(id, pid) {
    const doc = this.afs.doc(`users/${id}/products/${pid}`).valueChanges();
    doc.subscribe(data => {
      this.product = data;
      console.log(this.product);
      this.product.overview.forEach(item => {
        this.populateOverview(item);
      });
      this.product.pd.forEach(item => {
        this.populatePD(item);
      });
      this.product.orderPrices.forEach(item => {
        this.populatePrices(item);
      });
      this.product.variants.forEach(item => {
        this.populateVariants(item);
      });
      this.product.productImages.forEach(item => {
        this.populateImages(item);
      });
      this.ProductForm.patchValue({
        title: this.product.title,
        brand: this.product.brand,
        digital: this.product.digital,
        supplyAbility: this.product.supplyAbility,
        origin: this.product.origin,
        collection: this.product.collection,
        tags: this.product.tags,
        weight: this.product.weight
      });
    });
  }

  // Overview
  initOverview(): FormGroup {
    return this.fb.group({
      title: [
        '',
        Validators.compose([
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9-"()/:', ]*$/)
        ])
      ],
      value: [
        '',
        Validators.compose([
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9-"/():', ]*$/)
        ])
      ]
    });
  }
  addOverview() {
    const newO = this.ProductForm.get('overview') as FormArray;
    newO.push(this.initOverview());
    console.log(this.ProductForm.get('overview').value);
  }
  populateOverview(item) {
    const newO = this.ProductForm.get('overview') as FormArray;
    const overviewItem = this.fb.group({
      title: item.title,
      value: item.value
    });
    newO.push(overviewItem);
  }
  // Packagin Delivery
  initPD(): FormGroup {
    return this.fb.group({
      title: [
        '',
        Validators.compose([
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9-"/:()', ]*$/)
        ])
      ],
      value: [
        '',
        Validators.compose([
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9-"/:', ]*$/)
        ])
      ]
    });
  }
  addPD() {
    const newO = this.ProductForm.get('pd') as FormArray;
    newO.push(this.initPD());
    console.log(this.ProductForm.get('pd').value);
  }
  populatePD(item) {
    const newO = this.ProductForm.get('pd') as FormArray;
    const npd = this.fb.group({
      title: [
        item.title,
        Validators.compose([
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9-"/:()', ]*$/)
        ])
      ],
      value: [
        item.value,
        Validators.compose([
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9-"/:', ]*$/)
        ])
      ]
    });
    newO.push(npd);
  }
  // Manage Variants
  initVariant(): FormGroup {
    return this.fb.group({
      optionName: [
        'Color',
        Validators.compose([Validators.pattern(/^[a-zA-Z0-9-, ]*$/)])
      ],
      optionValue: [
        'Black',
        Validators.compose([Validators.pattern(/^[a-zA-Z0-9-, ]*$/)])
      ]
    });
  }
  addVariant() {
    const newV = this.ProductForm.get('variants') as FormArray;
    newV.push(this.initVariant());
  }
  populateVariants(item) {
    const newV = this.ProductForm.get('variants') as FormArray;
    const variant = this.fb.group({
      optionName: [
        item.optionName,
        Validators.compose([Validators.pattern(/^[a-zA-Z0-9-, ]*$/)])
      ],
      optionValue: [
        item.optionValue,
        Validators.compose([Validators.pattern(/^[a-zA-Z0-9-, ]*$/)])
      ]
    });
    newV.push(variant);
  }
  // Mange Price
  initPrices(): FormGroup {
    return this.fb.group({
      qmin: ['', Validators.compose([Validators.pattern(/^[0-9]*$/)])],
      qmax: ['', Validators.compose([Validators.pattern(/^[0-9]*$/)])],
      qprice: ['', Validators.compose([Validators.pattern(/^[0-9.]*$/)])]
    });
  }
  addPrice() {
    const newC = this.ProductForm.get('orderPrices') as FormArray;
    newC.push(this.initPrices());
    console.log(this.ProductForm.get('orderPrices').value);
  }
  populatePrices(item) {
    const newO = this.ProductForm.get('orderPrices') as FormArray;
    const price = this.fb.group({
      qmin: [item.qmin, Validators.compose([Validators.pattern(/^[0-9]*$/)])],
      qmax: [item.qmax, Validators.compose([Validators.pattern(/^[0-9]*$/)])],
      qprice: [
        item.qprice,
        Validators.compose([Validators.pattern(/^[0-9.]*$/)])
      ]
    });
    newO.push(price);
  }

  // Upload product images
  initProductImages(url): FormGroup {
    return this.fb.group({
      productImage: [url]
    });
  }
  addImageUrl(url) {
    const picForm = this.ProductForm.get('productImages') as FormArray;
    picForm.push(this.initProductImages(url));
  }
  populateImages(item) {
    const picForm = this.ProductForm.get('productImages') as FormArray;
    const picture = this.fb.group({
      productImage: [item.productImage]
    });
    picForm.push(picture);
  }
  startUpload(event: FileList) {
    const uid = this.us.getUserID();
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.log('Please upload an valid iamge!');
      this.imageError = true;
      return;
    } else {
      // Storage path
      const path = `${uid}/products/${file.name}`;
      this.task = this.afStorage.upload(path, file);
      this.task.snapshotChanges().subscribe(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          snap.ref
            .getDownloadURL()
            .then(url => {
              this.addImageUrl(url);
            })
            .then(() => {
              console.log('Image successfylly uploaded!');
              console.log(this.ProductForm.get('productImages').value);
              this.imageError = false;
            })
            .catch(function() {
              this.imageError = true;
            });
        }
      });
    }
  }

  // Complete Form Adding Product
  addNewProduct() {
    const productDoc = this.afs.doc(`users/${this.id}/products/${this.pid}`);
    productDoc.update(this.ProductForm.value);
    this.router.navigate(['/allproducts']);
  }
  removeProduct() {
    const productDoc = this.afs.doc(`users/${this.id}/products/${this.pid}`);
    productDoc.delete();
    this.router.navigate(['/allproducts']);
  }
}
