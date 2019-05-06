import { UserDataService } from './../../../services/user-data.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import {
  AngularFireUploadTask,
  AngularFireStorage
} from 'angularfire2/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-addnew',
  templateUrl: './addnew.component.html',
  styleUrls: ['./addnew.component.scss']
})
export class AddnewComponent implements OnInit {
  // AngularFirestore
  task: AngularFireUploadTask;
  snapshot: Observable<any>;
  // Initializing form
  ProductForm: FormGroup;
  imageCounter = 0;
  imageError = false;
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
    private afStorage: AngularFireStorage
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
      overview: this.fb.array([this.initOverview()]),
      pd: this.fb.array([this.initPD()]),
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
      variants: this.fb.array([this.initVariant()]),
      orderPrices: this.fb.array([this.initPrices()]),
      productImages: this.fb.array([]),
      uid: [''],

    });
  }

  ngOnInit() {}
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
    ],
    });
  }
  addOverview() {
    const newO = this.ProductForm.get('overview') as FormArray;
    newO.push(this.initOverview());
    console.log(this.ProductForm.get('overview').value);
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
    ],
    });
  }
  addPD() {
    const newO = this.ProductForm.get('pd') as FormArray;
    newO.push(this.initPD());
    console.log(this.ProductForm.get('pd').value);
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
    console.log(this.ProductForm.get('variants').value);
  }
  // Mange Price
  initPrices(): FormGroup {
    return this.fb.group({
      qmin: [
        '',
        Validators.compose([Validators.pattern(/^[0-9]*$/)])
      ],
      qmax: [
        '',
        Validators.compose([Validators.pattern(/^[0-9]*$/)])
      ],
      qprice: [
        '',
        Validators.compose([Validators.pattern(/^[0-9.]*$/)])
      ]
    });
  }
  addPrice() {
    const newC = this.ProductForm.get('orderPrices') as FormArray;
    newC.push(this.initPrices());
    console.log(this.ProductForm.get('orderPrices').value);
  }
  // Complete Form Adding Product
  addNewProduct() {
    const uid = this.us.getUserID();
    const path = `users/${uid}/products`;
    this.afs
      .collection(path)
      .add(this.ProductForm.value)
      .then(docRef => {
        console.log(docRef.id);
      })
      .catch(function(error) {
        console.error('Error adding document: ', error);
      });
  }

  // Upload product images
  initProductImages(url): FormGroup {
    return this.fb.group({
      productImage: [
        url
      ]
    });
  }
  addImageUrl(url) {
    const picForm = this.ProductForm.get('productImages') as FormArray;
    picForm.push(this.initProductImages(url));
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
              // console.log('Image successfylly uploaded!');
              // console.log(this.ProductForm.get('productImages').value);
              this.imageError = false;
            })
            .catch(function() {
              this.imageError = true;
            });
        }
      });
    }
  }
}
