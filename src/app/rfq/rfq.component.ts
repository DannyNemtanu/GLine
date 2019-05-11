import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  UserDataService
} from 'src/app/services/user-data.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
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
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.scss']
})
export class RfqComponent implements OnInit {
  // AngularFirestore
  task: AngularFireUploadTask;
  snapshot: Observable < any > ;
  id: any; // Generating ID
  imageError = false;
  rfqForm: FormGroup;
  rfqValidation = {
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
    destination: [{
        type: 'required',
        message: 'Produced is required!'
      },
      {
        type: 'pattern',
        message: 'Please make sure you use safe characters!'
      }
    ],
    productImage: [{
      type: 'pattern',
      message: 'File not supported!'
    }],
  };

  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private us: UserDataService,
    private afStorage: AngularFireStorage,
    private router: Router,
  ) {
    this.rfqForm = this.fb.group({
      uid: [
        this.us.getUserID()
      ],
      title: [
        'Sample Product',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^[a-zA-Z0-9-"', ]*$/)
        ])
      ],
      description: [
        'Product Description',
        Validators.compose([
          Validators.required,
          Validators.minLength(50),
          Validators.pattern(/^^(.|\s)*[a-zA-Z]+(.|\s)*$/)
        ])
      ],
      destination: [
        'Romania',
        Validators.compose([Validators.pattern(/^[a-zA-Z0-9-,. ]*$/)])
      ],
      orderPrices: this.fb.array([this.initPrices()]),
      productImages: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.id = this.afs.createId();
    // console.log('Generated ID: ' + this.id);
  }

  // Mange Price
  initPrices(): FormGroup {
    return this.fb.group({
      quantity: [
        '',
        Validators.compose([Validators.pattern(/^[0-9]*$/)])
      ],
      price: [
        '',
        Validators.compose([Validators.pattern(/^[0-9.]*$/)])
      ]
    });
  }
  addPrice() {
    const newC = this.rfqForm.get('orderPrices') as FormArray;
    newC.push(this.initPrices());
    // console.log(this.rfqForm.get('orderPrices').value);
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
    const picForm = this.rfqForm.get('productImages') as FormArray;
    picForm.push(this.initProductImages(url));
  }
  startUpload(event: FileList) {
    const uid = this.us.getUserID();
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      // console.log('Please upload an valid iamge!');
      this.imageError = true;
      return;
    } else {
      // Storage path
      const path = `${uid}/rfq/${this.id}/${file.name}`;
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
              // console.log(this.rfqForm.get('productImages').value);
              this.imageError = false;
            })
            .catch(function () {
              this.imageError = true;
            });
        }
      });
    }
  }
  deleteIamges() {
    const images = this.rfqForm.get('productImages').value;
    images.forEach(image => {
      const imageURL = image.productImage;
      this.afStorage.storage.refFromURL(`${imageURL}`).delete();
    });
    this.router.navigate(['dashboard']);
  }
  addNewRFQ() {
    const imageArray: Array < any > = this.rfqForm.get('productImages').value;
    if (imageArray.length < 1) {
      alert('No images!');
    } else {
      const uid = this.us.getUserID();
      const path = `users/${uid}/rfq/${this.id}`;
      this.afs
        .doc(path)
        .set(this.rfqForm.value).then(() => {
          this.router.navigate(['myrequests']);
        });
    }
    // console.log(this.rfqForm.value);
  }
}
