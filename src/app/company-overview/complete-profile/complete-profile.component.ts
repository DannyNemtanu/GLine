import {
  UserDataService
} from './../../services/user-data.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  AngularFirestoreDocument,
  AngularFirestore
} from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import {
  Observable
} from 'rxjs';
import {
  SafeResourceUrl,
  DomSanitizer
} from '@angular/platform-browser';
import {
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {
  // Logging user
  currentUser;
  // Angular Storage
  task: AngularFireUploadTask;
  percentage: Observable < number > ;
  snapshot: Observable < any > ;
  currentYear = new Date();
  // Profile Picture
  showImage = false;
  uploadStatus = 'Not Uploaded';
  uploadedImage = '';
  uploadProgress: any = 0;
  image = '../../../assets/images/Upload.png';

  // Form Flow
  flow = 1;
  picture: any;
  prodOne = '../../../assets/images/upload-icon.png';
  prodThree = '../../../assets/images/upload-icon.png';
  prodFour = '../../../assets/images/upload-icon.png';
  prodTwo = '../../../assets/images/upload-icon.png';

  // Initializing forms steps
  formOne: FormGroup;
  formTwo: FormGroup;
  formThree: FormGroup;
  formFour: FormGroup;
  formFive: FormGroup;

  // Changing form styling
  progressOne = 'uncompleted';
  progressTwo = 'uncompleted';
  progressThree = 'uncompleted';
  progressFour = 'uncompleted';
  progressFive = 'uncompleted';

  // Google Maps
  location = 'NCI Mayor Square';
  gmap = this.getMapLocation(this.location);
  start_step = 1;
  step: string;

  // Data to be updated into database
  form_data = {
    companyProfile: {
      currentYear: 0,
      profilePicture: '',
      tradingName: '',
      registrationNumber: '',
      establishedDate: {
        day: '',
        month: '',
        year: ''
      },
      websiteURL: '',
      addr: '',
      telephone: '',
      mobilePhone: '',
      fax: '',
      emailAddress: '',
      managerName: '',
      businessDescription: '',
      productFlow: {
        stepOne: {
          imageUrl: '',
          title: ''
        },
        stepTwo: {
          imageUrl: '',
          title: ''
        },
        stepThree: {
          imageUrl: '',
          title: ''
        },
        stepFour: {
          imageUrl: '',
          title: ''
        }
      },
      mainProducts: '',
      businessCertification: '',
      businessPatents: '',
      businessTrademarks: '',
      annualSales: {
        min: '',
        max: ''
      },
      mainMarkets: '',
      numberOfEmployees: {
        min: '',
        max: ''
      }
    }
  };
  // Form Validation displaying error messages
  profile_validation = {
    // Step One
    profilePicture: [{
        type: 'required',
        message: 'Business profile picture is required'
      },
      {
        type: 'pattern',
        message: 'Trading name must contain only numbers and letters'
      }
      // { type: 'validName', message: 'Trading name has already been taken' }
    ],
    tradingName: [{
        type: 'required',
        message: 'Trading name is required'
      },
      {
        type: 'minlength',
        message: 'Trading name must be at least 4 characters long'
      },
      {
        type: 'maxlength',
        message: 'Trading name be more than 25 characters long'
      },
      {
        type: 'pattern',
        message: 'Trading name must contain only numbers and letters'
      }
      // { type: 'validName', message: 'Trading name has already been taken' }
    ],
    registrationNumber: [{
        type: 'required',
        message: 'Registration number is required'
      },
      {
        type: 'minlength',
        message: 'Registration number must be at least 4 characters long'
      },
      {
        type: 'maxlength',
        message: 'Registration number be more than 25 characters long'
      },
      {
        type: 'pattern',
        message: 'Registration number must contain only numbers and letters'
      }
    ],
    day: [{
        type: 'required',
        message: 'Day is required'
      },
      {
        type: 'maxlength',
        message: 'Max length is 2'
      },
      {
        type: 'pattern',
        message: 'Date between 1 - 31'
      }
    ],
    month: [{
        type: 'required',
        message: 'Month is required'
      },
      {
        type: 'pattern',
        message: 'Please insert valid month'
      }
    ],
    year: [{
        type: 'required',
        message: 'Year is required'
      },
      {
        type: 'maxlength',
        message: 'Maximum length is 4'
      },
      {
        type: 'pattern',
        message: 'Year between 1970 - 2019'
      }
    ],
    websiteURL: [{
      type: 'pattern',
      message: 'Please insert valid URL'
    }],
    // Step two
    addr: [{
        type: 'required',
        message: 'Address is required'
      },
      {
        type: 'pattern',
        message: 'Include only letters and numbers'
      },
      {
        type: 'maxlength',
        message: 'Maximum 10 characters long'
      },
      {
        type: 'minlength',
        message: 'Minimum 5 characters long'
      }
    ],
    mobilePhone: [{
        type: 'required',
        message: 'Mobile number is required'
      },
      {
        type: 'pattern',
        message: 'Enter a valid mobile number'
      },
      {
        type: 'maxlength',
        message: 'Maximum 10 characters long'
      }
    ],
    telephone: [{
      type: 'pattern',
      message: 'Enter a valid telephone number'
    }],
    fax: [{
        type: 'pattern',
        message: 'Enter a valid telephone number'
      },
      {
        type: 'maxlength',
        message: 'Maximum 10 characters long'
      }
    ],
    emailAddress: [{
        type: 'required',
        message: 'Email is required'
      },
      {
        type: 'pattern',
        message: 'Enter a valid email'
      },
      {
        type: 'maxlength',
        message: 'Maximum 50 characters long'
      }
    ],
    managerName: [{
        type: 'required',
        message: 'Manager name is required'
      },
      {
        type: 'pattern',
        message: 'Should contain letters only!'
      },
      {
        type: 'maxlength',
        message: 'Maximum 20 characters long'
      }
    ],
    // Step Three
    businessDescription: [{
        type: 'required',
        message: 'Description is required'
      },
      {
        type: 'maxlength',
        message: 'Maximum 50 characters long'
      }
    ],
    mainProducts: [{
        type: 'required',
        message: 'Main products are required'
      },
      {
        type: 'pattern',
        message: 'Please separate the products using comma.'
      },
      {
        type: 'maxlength',
        message: 'Maximum 150 characters long'
      }
    ],
    // Step Four
    businessCertification: [{
        type: 'pattern',
        message: 'Please separate certificates using comma.'
      },
      {
        type: 'maxlength',
        message: 'Maximum 100 characters long'
      }
    ],
    businessPatents: [{
        type: 'pattern',
        message: 'Please separate patents using comma.'
      },
      {
        type: 'maxlength',
        message: 'Maximum 100 characters long'
      }
    ],
    businessTrademarks: [{
        type: 'pattern',
        message: 'Please separate trademarks using comma.'
      },
      {
        type: 'maxlength',
        message: 'Maximum 100 characters long'
      }
    ],
    // Step Five
    asmin: [{
      type: 'pattern',
      message: 'Enter valid number.'
    }],
    asmax: [{
      type: 'pattern',
      message: 'Enter valid number.'
    }],
    mainMarkets: [{
        type: 'pattern',
        message: 'Please separate main markets using comma. Do not use prohibitted charachters such as ("<","","/")'
      },
      {
        type: 'maxlength',
        message: 'Maximum 500 characters long'
      }
    ],
    nemin: [{
      type: 'pattern',
      message: 'Enter valid number.'
    }],
    nemax: [{
      type: 'pattern',
      message: 'Enter valid number.'
    }]
  };

  constructor(
    private afs: AngularFirestore,
    private user: UserDataService,
    private afStorage: AngularFireStorage,
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    public router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.user.getUserID();
    // Starting form
    this.step = 'one';
    this.progressOne = 'active';

    // Form Validation
    this.formOne = this.fb.group({
      profilePicture: [this.picture, Validators.required],
      tradingName: [
        '',
        Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(4),
          Validators.required
        ])
      ],
      registrationNumber: [
        '',
        Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(4),
          Validators.required
        ])
      ],
      day: [
        '',
        Validators.compose([
          Validators.maxLength(2),
          Validators.minLength(1),
          Validators.pattern(/0[1-9]|[12]\d|3[01]/),
          Validators.required
        ])
      ],
      month: [
        '',
        Validators.compose([
          Validators.pattern(
            // tslint:disable-next-line:max-line-length
            /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)/
          ),
          Validators.required
        ])
      ],
      year: [
        '',
        Validators.compose([
          Validators.maxLength(4),
          Validators.pattern(/19[789]\d|20[01]\d/),
          Validators.required
        ])
      ],
      websiteURL: [
        '',
      ]
    });
    this.formTwo = this.fb.group({
      addr: [
        'NCI Mayor Square',
        Validators.compose([
          Validators.maxLength(50),
          Validators.minLength(5),
          Validators.pattern(/^[#.0-9a-zA-Z\s,-]+$/),
          Validators.required
        ])
      ],
      telephone: [
        '',
        Validators.compose([
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/)
        ])
      ],
      mobilePhone: [
        '',
        Validators.compose([
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/),
          Validators.required
        ])
      ],
      fax: [
        '',
        Validators.compose([
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/)
        ])
      ],
      emailAddress: [
        '',
        Validators.compose([
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/),
          Validators.required
        ])
      ],
      managerName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(
            /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
          )
        ])
      ]
    });
    this.formThree = this.fb.group({
      businessDescription: [
        // tslint:disable-next-line:max-line-length
        '',
        Validators.compose([
          Validators.maxLength(500),
          Validators.minLength(50),
          Validators.required
        ])
      ],
      poimg: [''],
      potitle: [''],
      psimg: [''],
      pstitle: [''],
      ptimg: [''],
      pttitle: [''],
      pfimg: [''],
      pftitle: [''],
      mainProducts: [
        '',
        Validators.compose([
          Validators.maxLength(400),
          Validators.minLength(5), ,
          Validators.required
        ])
      ]
    });
    this.formFour = this.fb.group({
      businessCertification: [
        '',
        Validators.compose([
          Validators.maxLength(100),

        ])
      ],
      businessPatents: [
        '',
        Validators.compose([
          Validators.maxLength(100),

        ])
      ],
      businessTrademarks: [
        '',
        Validators.compose([
          Validators.maxLength(100),

        ])
      ]
    });
    this.formFive = this.fb.group({
      asmin: [
        '',
        Validators.compose([Validators.pattern(/^[0-9]*$/)])
      ],
      asmax: [
        '',
        Validators.compose([Validators.pattern(/^[0-9]*$/)])
      ],
      mainMarkets: [
        // tslint:disable-next-line:max-line-length
        '',
        Validators.compose([
          Validators.maxLength(500)
        ])
      ],
      nemin: ['', Validators.compose([Validators.pattern(/^[0-9]*$/)])],
      nemax: ['', Validators.compose([Validators.pattern(/^[0-9]*$/)])]
    });
  }
  // Google Maps Location Update & Display
  updateLocation() {
    this.gmap = this.getMapLocation(this.formTwo.get('addr').value);
  }
  getMapLocation(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed/v1/place?key=AIzaSyDPDQlf8XLxO1ytPRdW95vPrrhRm91gvlQ&q=' +
      url
    );
  }

  // Upload Profile Picture
  startUpload(event: FileList) {
    const uid = this.user.getUserID();
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      // console.log('Please upload an valid iamge!');
      return;
    } else {
      // Storage path
      const path = `${uid}/profilePicture`;
      // @reference https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
      // @reference https://www.youtube.com/watch?v=wRWZQwiNFnM
      
      this.task = this.afStorage.upload(path, file);

      this.task.percentageChanges().subscribe(data => {
        this.uploadProgress = data.toFixed();
      });
      try {
        this.task.snapshotChanges().subscribe(snap => {
          if (snap.bytesTransferred === snap.totalBytes) {
            snap.ref.getDownloadURL().then(url => {
              this.uploadedImage = url;
              // this.form_data.companyProfile.profilePicture = url;
              this.formOne.patchValue({
                profilePicture: url
              });
              this.showImage = true;
            });
            this.uploadStatus = 'Uploaded';
          }
        });
      } catch (e) {
        throw new Error(`Failde uploading profile image ${this.currentUser}`);
      }
    }
  }
  // Reset Image Upload
  resetImageUpdate() {
    this.flow = 1;
    this.prodOne = '../../../assets/images/upload-icon.png';
    this.prodThree = '../../../assets/images/upload-icon.png';
    this.prodFour = '../../../assets/images/upload-icon.png';
    this.prodTwo = '../../../assets/images/upload-icon.png';
  }
  // Upload product flow
  prodFlow(event: FileList) {
    const uid = this.user.getUserID();
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      // console.log('Please upload an valid iamge!');
      return;
    }

    // Storage path
    const path = `${uid}/flow/${this.flow}`;
    this.task = this.afStorage.upload(path, file);

    try {
      this.task.snapshotChanges().subscribe(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          snap.ref
            .getDownloadURL()
            .then(url => {
              this.uploadedImage = url;
              if (this.flow === 1) {
                this.prodOne = url;
                this.formThree.patchValue({
                  poimg: url
                });
              }
              if (this.flow === 2) {
                this.prodTwo = url;
                this.formThree.patchValue({
                  psimg: url
                });
              }
              if (this.flow === 3) {
                this.prodThree = url;
                this.formThree.patchValue({
                  ptimg: url
                });
              }
              if (this.flow === 4) {
                this.prodFour = url;
                this.formThree.patchValue({
                  pfimg: url
                });
              }
              if (this.flow === 5) {
                alert(
                  'Maximum number of steps uploaded! \nPress on start again to update images!'
                );
              }
            })
            .then(() => {
              if (this.flow < 6) {
                this.flow = this.flow + 1;
                // console.log('Flow ' + this.flow);
              }
              if (this.flow > 6) {
                throw new Error('Complete profile flow error' + this.currentUser);
              }
            });
        }
      });
    } catch (e) {
      throw new Error(`Failde uploading profile image ${this.currentUser}`);
    }

  }

  // Submitting form steps
  // @reference https://angular.io/guide/reactive-forms
  // @reference https://www.youtube.com/watch?v=6Y_0MJWlPK8
  // @reference https://www.youtube.com/watch?v=q3t_hzkAnQE
  stepOne() {
    const form = this.form_data.companyProfile;
    form.profilePicture = this.formOne.get('profilePicture').value;
    form.tradingName = this.formOne.get('tradingName').value;
    form.registrationNumber = this.formOne.get('registrationNumber').value;
    form.establishedDate.day = this.formOne.get('day').value;
    form.establishedDate.month = this.formOne.get('month').value;
    form.establishedDate.year = this.formOne.get('year').value;
    form.websiteURL = this.formOne.get('websiteURL').value;
    this.next();
  }
  stepTwo() {
    const form = this.form_data.companyProfile;
    form.addr = this.formTwo.get('addr').value;
    form.telephone = this.formTwo.get('telephone').value;
    form.mobilePhone = this.formTwo.get('mobilePhone').value;
    form.fax = this.formTwo.get('fax').value;
    form.emailAddress = this.formTwo.get('emailAddress').value;
    form.managerName = this.formTwo.get('managerName').value;
    this.next();
  }
  stepThree() {
    const form = this.form_data.companyProfile;
    form.businessDescription = this.formThree.get('businessDescription').value;

    form.productFlow.stepOne.imageUrl = this.formThree.get('poimg').value;
    form.productFlow.stepOne.title = this.formThree.get('potitle').value;

    form.productFlow.stepTwo.imageUrl = this.formThree.get('psimg').value;
    form.productFlow.stepTwo.title = this.formThree.get('pstitle').value;

    form.productFlow.stepThree.imageUrl = this.formThree.get('ptimg').value;
    form.productFlow.stepThree.title = this.formThree.get('pttitle').value;

    form.productFlow.stepFour.imageUrl = this.formThree.get('pfimg').value;
    form.productFlow.stepFour.title = this.formThree.get('pftitle').value;
    form.mainProducts = this.formThree.get('mainProducts').value;
    this.next();
  }
  stepFour() {
    const form = this.form_data.companyProfile;
    form.businessCertification = this.formFour.get(
      'businessCertification'
    ).value;
    form.businessPatents = this.formFour.get('businessPatents').value;
    form.businessTrademarks = this.formFour.get('businessTrademarks').value;
    this.next();
  }
  stepFive() {
    const form = this.form_data.companyProfile;
    form.annualSales.min = this.formFive.get('asmin').value;
    form.annualSales.max = this.formFive.get('asmax').value;
    form.mainMarkets = this.formFive.get('mainMarkets').value;
    form.numberOfEmployees.min = this.formFive.get('nemin').value;
    form.numberOfEmployees.max = this.formFive.get('nemax').value;
    this.completeProfile();
  }
  // Continue to next step
  next() {
    try {
      this.start_step = this.start_step + 1;
      this.changeState(this.start_step);
    } catch (e) {
      throw new Error(`Could not update to next state ${this.currentUser}`);
    }
  }
  // Change Form State
  changeState(num) {
    // console.log(this.step);
    // Checking Swithc Statement
    if (num === 1) {
      this.step = 'one';
      this.progressOne = 'active';
    }
    if (num === 2) {
      if (this.formOne.valid) {
        this.step = 'two';
        this.progressOne = 'completed';
        this.progressTwo = 'active';
      }
    }
    if (num === 3) {
      if (this.formTwo.valid) {
        this.step = 'three';
        this.progressOne = 'completed';
        this.progressTwo = 'completed';
        this.progressThree = 'active';
      }
    }
    if (num === 4) {
      if (this.formThree.valid) {
        this.step = 'four';
        this.progressOne = 'completed';
        this.progressTwo = 'completed';
        this.progressThree = 'completed';
        this.progressFour = 'active';
      }
    }
    if (num === 5) {
      if (this.formFour.valid) {
        this.step = 'five';
        this.progressOne = 'completed';
        this.progressTwo = 'completed';
        this.progressThree = 'completed';
        this.progressFour = 'completed';
        this.progressFive = 'active';
      }
    }
    if (num === 6) {
      if (this.formFive.valid) {
        this.progressFive = 'completed';
        this.completeProfile();
      }
    }
    // console.log(this.form_data);
  }

  // Updating the company profile
  completeProfile() {
    const user = this.user.getUserID();
    const doc = this.afs.doc(`users/${user}`);
    doc.valueChanges().subscribe((data: any) => {
      const profile = data.completedProfile;
      if (profile) {
        this.form_data.companyProfile.currentYear =
          data.companyProfile.currentYear;
      } else {
        this.form_data.companyProfile.currentYear = this.currentYear.getFullYear();
      }
      return doc.update(this.form_data).then(() => {
        doc.update({
          completedProfile: true
        });
        this.router.navigate(['overview', user]);
      }).catch(() => {
        throw new Error(`Updating profile data failde ${this.currentUser}`);
      });
    });
    // return userRef.set(this.form_data, {
    //   merge: true
    // });
  }
}
