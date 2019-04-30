import { UserDataService } from './../../../services/user-data.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireUploadTask } from 'angularfire2/storage';
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
  variant: FormArray;
  imageCounter = 0;
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
    ]
  };
  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private us: UserDataService
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
      description: [
        'Description is not too long at the momment need improvements',
        Validators.compose([
          Validators.required,
          Validators.minLength(30),
          Validators.pattern(/^[a-zA-Z0-9-"', ]*$/)
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
      pricingmin: [
        '150',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]*$/)
        ])
      ],
      pricingmax: [
        '250',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]*$/)
        ])
      ],
      qmin: [
        '3',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]*$/)
        ])
      ],
      qmax: [
        '1000',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]*$/)
        ])
      ],
      digital: [false],
      weight: ['0.850', Validators.compose([Validators.pattern(/^[0-9.]*$/)])],
      origin: [
        'Romania',
        Validators.compose([Validators.pattern(/^[a-zA-Z0-9-,. ]*$/)])
      ],
      variants: this.fb.array([this.initVariant()]),
      stockQuantity: [
        '10000',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]*$/)
        ])
      ]
    });
  }

  ngOnInit() {}
  initVariant(): FormGroup {
    return this.fb.group({
      optionName: [
        'Color',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9-, ]*$/)
        ])
      ],
      optionValue: [
        'Black',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9-, ]*$/)
        ])
      ]
    });
  }
  addVariant() {
    const control = <FormArray>this.ProductForm.controls.variants;
    control.push(this.initVariant());
  }
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
  startUpload(event: FileList) {
    const uid = this.us.getUserID();
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.log('Please upload an valid iamge!');
      return;
    } else {
      // Storage path
      const path = `users/${uid}/products`;
      this.afs.collection(path).add(this.ProductForm);
      // this.task = this.afStorage.upload(path, file);

      this.task.snapshotChanges().subscribe(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          snap.ref.getDownloadURL().then(url => {
            console.log(url);
          });
        }
      });
    }
  }
}
