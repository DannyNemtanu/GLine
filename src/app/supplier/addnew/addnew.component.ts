import {
  DomSanitizer
} from '@angular/platform-browser';
import {
  UserDataService
} from '../../services/user-data.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  AngularFireUploadTask,
  AngularFireStorage
} from 'angularfire2/storage';
import {
  Observable
} from 'rxjs';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-addnew',
  templateUrl: './addnew.component.html',
  styleUrls: ['./addnew.component.scss']
})
export class AddnewComponent implements OnInit {
  // AngularFirestore
  task: AngularFireUploadTask;
  snapshot: Observable < any > ;
  // Initializing form
  ProductForm: FormGroup;
  imageCounter = 0;
  imageError = false;
  productValidation = {
    // Step One
    title: [{
        type: 'required',
        message: 'Title is required!'
      },
      {
        type: 'minlength',
        message: 'Minimum 5 characters'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    description: [{
        type: 'required',
        message: 'Description is required!'
      },
      {
        type: 'minlength',
        message: 'Minimum 30 characters'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    type: [{
        type: 'required',
        message: 'Type is required!'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    brand: [{
        type: 'required',
        message: 'Brand is required!'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    collection: [{
        type: 'required',
        message: 'Collection is required!'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    tags: [{
        type: 'required',
        message: 'Tags are required!'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    pricingmin: [{
        type: 'required',
        message: 'Min is required!'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters! \n The number is valid !'
      }
    ],
    pricingmax: [{
        type: 'required',
        message: 'Max is required!'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters! \n The number is valid !'
      }
    ],
    qmin: [{
        type: 'required',
        message: 'Min is required!'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters! \n The number is valid !'
      }
    ],
    qmax: [{
        type: 'required',
        message: 'Max is required!'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters! \n The number is valid !'
      }
    ],
    weight: [{
      type: 'pattern',
      message: 'Please make sure you use safe characters! \n The number is valid !'
    }],
    origin: [{
      type: 'pattern',
      message: 'Please make sure you use safe characters!'
    }],
    productImage: [{
      type: 'pattern',
      message: 'File not supported!'
    }],
    supplyAbility: [{
        type: 'pattern',
        message: 'Please include allowed characters!'
      },
      {
        type: 'required',
        message: 'Supply Required!'
      }
    ],
    optionName: [{
        type: 'pattern',
        message: 'Please include allowed characters!'
      },
      {
        type: 'required',
        message: 'Required!'
      }
    ],
    optionValue: [{
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
    private router: Router,
    private san: DomSanitizer,
  ) {
    this.ProductForm = this.fb.group({
      title: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5)
        ])
      ],
      overview: this.fb.array([this.initOverview()]),
      pd: this.fb.array([this.initPD()]),
      supplyAbility: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      type: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      brand: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      collection: [
        '',
        Validators.compose([
          Validators.required,
        ])
      ],
      tags: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      digital: [false],
      weight: ['', Validators.compose([Validators.pattern(/^[0-9.]*$/)])],
      origin: [
        ''
      ],
      variants: this.fb.array([this.initVariant()]),
      orderPrices: this.fb.array([this.initPrices()]),
      productImages: this.fb.array([]),
      uid: [''],

    });
  }

  ngOnInit() {
    this.initForm();
  }
  // Overview
  initOverview(): FormGroup {
    return this.fb.group({
      title: [
        '',
        Validators.compose([
          Validators.maxLength(50)
        ])
      ],
      value: [
        '',
        Validators.compose([
          Validators.maxLength(50)
        ])
      ],
    });
  }
  initForm() {
    for (let i = 0; i < 8; i++) {
      this.addOverview();
    }
    this.ProductForm.patchValue({
      title: 'Mini Dual V5.0 Wireless Earphones',
      overview: [{
          title: 'Communication',
          value: 'Wireless'
        },
        {
          title: 'Support Memory Card',
          value: 'No'
        },
        {
          title: 'Vocalism Principle',
          value: 'Hybrid technology'
        },
        {
          title: 'Strong compatibility',
          value: 'Main devices and. Apps supported'
        },
        {
          title: 'Operation Distance',
          value: 'Up to 10 meters/ 33 feet(Free Space)'
        },
        {
          title: 'Resistance',
          value: '32Ω'
        },
        {
          title: 'Style',
          value: 'In-Ear'
        },
        {
          title: 'Control Button',
          value: 'No'
        },
        {
          title: 'Model Number',
          value: 'T1'
        }
      ],
      supplyAbility: '1200 per month',
      weight: '0.5',
      pd: [{
        title: 'Package Size',
        value: '15cm x 15cm x 15cm (5.91in x 5.91in x 5.91in)'
      }],
      orderPrices: [{
        qmin: '100',
        qmax: '200',
        qprice: '3.5'
      }],
      origin: 'Italy',
      variants: [{
        optionName: 'color',
        optionValue: 'black'
      }],
      type: 'Earphone',
      brand: 'GoldenLine T2',
      collection: 'Earpods, accesories, ears, sound, music, listener',
      tags: 'Earpods, accesories, ears, sound, music, listener'
    });
  }
  addOverview() {
    const newO = this.ProductForm.get('overview') as FormArray;
    newO.push(this.initOverview());
    // console.log(this.ProductForm.get('overview').value);
  }
  // Packagin Delivery
  initPD(): FormGroup {
    return this.fb.group({
      title: [
        '',
        Validators.compose([
          Validators.maxLength(50)
        ])
      ],
      value: [
        '',
        Validators.compose([
          Validators.maxLength(50)
        ])
      ],
    });
  }
  addPD() {
    const newO = this.ProductForm.get('pd') as FormArray;
    newO.push(this.initPD());
    // console.log(this.ProductForm.get('pd').value);
  }
  // Manage Variants
  initVariant(): FormGroup {
    return this.fb.group({
      optionName: [
        'Color'
      ],
      optionValue: [
        'Black'
      ]
    });
  }
  addVariant() {
    const newV = this.ProductForm.get('variants') as FormArray;
    newV.push(this.initVariant());
    // console.log(this.ProductForm.get('variants').value);
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
    // console.log(this.ProductForm.get('orderPrices').value);
  }
  // Complete Form Adding Product
  addNewProduct() {
    const uid = this.us.getUserID();
    const path = `users/${uid}/products`;
    this.afs
      .collection(path)
      .add(this.ProductForm.value)
      .then(docRef => {
        // console.log(docRef.id);
        this.router.navigate(['overview', uid]);
      })
      .catch(function (error) {
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
  // @reference https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
  // @reference https://www.youtube.com/watch?v=wRWZQwiNFnM
  startUpload(event: FileList) {
    const uid = this.us.getUserID();
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      // console.log('Please upload an valid iamge!');
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
            .catch(function () {
              this.imageError = true;
            });
        }
      });
    }
  }
}
