import { UserDataService } from './../../services/user-data.service';
import { Component, OnInit } from '@angular/core';
import {
  AngularFirestoreDocument,
  AngularFirestore
} from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {
  // Angular Storage
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
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
    profilePicture: [
      { type: 'required', message: 'Business profile picture is required' },
      {
        type: 'pattern',
        message: 'Trading name must contain only numbers and letters'
      }
      // { type: 'validName', message: 'Trading name has already been taken' }
    ],
    tradingName: [
      { type: 'required', message: 'Trading name is required' },
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
    registrationNumber: [
      { type: 'required', message: 'Registration number is required' },
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
    day: [
      { type: 'required', message: 'Day is required' },
      {
        type: 'maxlength',
        message: 'Max length is 2'
      },
      {
        type: 'pattern',
        message: 'Date between 1 - 31'
      }
    ],
    month: [
      { type: 'required', message: 'Month is required' },
      {
        type: 'pattern',
        message: 'Please insert valid month'
      }
    ],
    year: [
      { type: 'required', message: 'Year is required' },
      {
        type: 'maxlength',
        message: 'Maximum length is 4'
      },
      {
        type: 'pattern',
        message: 'Year between 1970 - 2019'
      }
    ],
    websiteURL: [
      {
        type: 'pattern',
        message: 'Please insert valid URL'
      }
    ],
    // Step two
    addr: [
      { type: 'required', message: 'Address is required' },
      { type: 'pattern', message: 'Include only letters and numbers' },
      { type: 'maxlength', message: 'Maximum 10 characters long' },
      { type: 'minlength', message: 'Minimum 5 characters long' }
    ],
    mobilePhone: [
      { type: 'required', message: 'Mobile number is required' },
      { type: 'pattern', message: 'Enter a valid mobile number' },
      { type: 'maxlength', message: 'Maximum 10 characters long' }
    ],
    telephone: [{ type: 'pattern', message: 'Enter a valid telephone number' }],
    fax: [
      { type: 'pattern', message: 'Enter a valid telephone number' },
      { type: 'maxlength', message: 'Maximum 10 characters long' }
    ],
    emailAddress: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' },
      { type: 'maxlength', message: 'Maximum 50 characters long' }
    ],
    managerName: [
      { type: 'required', message: 'Manager name is required' },
      { type: 'pattern', message: 'Should contain letters only!' },
      { type: 'maxlength', message: 'Maximum 20 characters long' }
    ],
    // Step Three
    businessDescription: [
      { type: 'required', message: 'Description is required' },
      {
        type: 'pattern',
        message:
          'Make sure you dont use prohibbited characters such as ("","<")'
      },
      { type: 'maxlength', message: 'Maximum 50 characters long' }
    ],
    mainProducts: [
      { type: 'required', message: 'Main products are required' },
      { type: 'pattern', message: 'Please separate the products using comma.' },
      { type: 'maxlength', message: 'Maximum 150 characters long' }
    ],
    // Step Four
    businessCertification: [
      { type: 'pattern', message: 'Please separate certificates using comma.' },
      { type: 'maxlength', message: 'Maximum 100 characters long' }
    ],
    businessPatents: [
      { type: 'pattern', message: 'Please separate patents using comma.' },
      { type: 'maxlength', message: 'Maximum 100 characters long' }
    ],
    businessTrademarks: [
      { type: 'pattern', message: 'Please separate trademarks using comma.' },
      { type: 'maxlength', message: 'Maximum 100 characters long' }
    ],
    // Step Five
    asmin: [{ type: 'pattern', message: 'Enter valid number.' }],
    asmax: [{ type: 'pattern', message: 'Enter valid number.' }],
    mainMarkets: [
      {
        type: 'pattern',
        message:
          'Please separate main markets using comma. Do not use prohibitted charachters such as ("<","","/")'
      },
      { type: 'maxlength', message: 'Maximum 500 characters long' }
    ],
    nemin: [{ type: 'pattern', message: 'Enter valid number.' }],
    nemax: [{ type: 'pattern', message: 'Enter valid number.' }]
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
    // Starting form
    this.step = 'one';
    this.progressOne = 'active';

    // Form Validation
    this.formOne = this.fb.group({
      profilePicture: [this.picture, Validators.required],
      tradingName: [
        'GoldenLine',
        Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(4),
          Validators.pattern(/^[a-zA-Z0-9_.-]*$/),
          Validators.required
        ])
      ],
      registrationNumber: [
        'GL12345',
        Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(4),
          Validators.pattern(/^[a-zA-Z0-9_.-]*$/),
          Validators.required
        ])
      ],
      day: [
        '26',
        Validators.compose([
          Validators.maxLength(2),
          Validators.minLength(1),
          Validators.pattern(/0[1-9]|[12]\d|3[01]/),
          Validators.required
        ])
      ],
      month: [
        'Aug',
        Validators.compose([
          Validators.pattern(
            // tslint:disable-next-line:max-line-length
            /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)/
          ),
          Validators.required
        ])
      ],
      year: [
        '1996',
        Validators.compose([
          Validators.maxLength(4),
          Validators.pattern(/19[789]\d|20[01]\d/),
          Validators.required
        ])
      ],
      websiteURL: [
        'https://www.gline.com',
        Validators.compose([
          Validators.pattern(
            // tslint:disable-next-line:max-line-length
            /^(?:(?:https):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
          )
        ])
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
        '+3531398812',
        Validators.compose([
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/)
        ])
      ],
      mobilePhone: [
        '+353877777777',
        Validators.compose([
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/),
          Validators.required
        ])
      ],
      fax: [
        '+3531321233',
        Validators.compose([
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/)
        ])
      ],
      emailAddress: [
        'support@gline.com',
        Validators.compose([
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/),
          Validators.required
        ])
      ],
      managerName: [
        'Dan Nemtanu',
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
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur,',
        Validators.compose([
          Validators.maxLength(500),
          Validators.minLength(50),
          Validators.pattern(/[\pL\pN_\-]+/),
          Validators.required
        ])
      ],
      poimg: [''],
      potitle: ['Raw Material'],
      psimg: [''],
      pstitle: ['Assembly'],
      ptimg: [''],
      pttitle: ['Life Testing'],
      pfimg: [''],
      pftitle: ['Inspection and Packaging'],
      mainProducts: [
        'Electronics, Phones, Mobile Phones',
        Validators.compose([
          Validators.maxLength(400),
          Validators.minLength(5),
          Validators.pattern(/^[a-zA-Z0-9-, ]*$/),
          Validators.required
        ])
      ]
    });
    this.formFour = this.fb.group({
      businessCertification: [
        'BQB,FCC,CE,CE,Test Report,Test Report,Test Report',
        Validators.compose([
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9-, ]*$/)
        ])
      ],
      businessPatents: [
        'Certificate of Registration for a UK Design',
        Validators.compose([
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9-, ]*$/)
        ])
      ],
      businessTrademarks: [
        'CALION',
        Validators.compose([
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9-, ]*$/)
        ])
      ]
    });
    this.formFive = this.fb.group({
      asmin: [
        '100000000',
        Validators.compose([Validators.pattern(/^[0-9]*$/)])
      ],
      asmax: [
        '500000000',
        Validators.compose([Validators.pattern(/^[0-9]*$/)])
      ],
      mainMarkets: [
        // tslint:disable-next-line:max-line-length
        'Domestic Market 60.00 % North America 15.00 % Eastern Asia 15.00 % Western Europe 5.00 % Central America 2.00 % South Asia 2.00 % Oceania 1.00 %',
        Validators.compose([
          Validators.maxLength(500),
          Validators.pattern(/^[a-zA-Z0-9-,.% ]*$/)
        ])
      ],
      nemin: ['45000', Validators.compose([Validators.pattern(/^[0-9]*$/)])],
      nemax: ['50000', Validators.compose([Validators.pattern(/^[0-9]*$/)])]
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
      console.log('Please upload an valid iamge!');
      return;
    } else {
      // Storage path
      const path = `${uid}/profilePicture`;
      this.task = this.afStorage.upload(path, file);

      this.task.percentageChanges().subscribe(data => {
        this.uploadProgress = data.toFixed();
      });
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
      console.log('Please upload an valid iamge!');
      return;
    }

    // Storage path
    const path = `${uid}/flow/${this.flow}`;
    this.task = this.afStorage.upload(path, file);

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
          });
      }
    });
  }

  // Submitting form steps
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
    this.start_step = this.start_step + 1;
    this.changeState(this.start_step);
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

    doc.valueChanges().subscribe(data => {
      const profile = data.completedProfile;
      if (profile) {
        this.form_data.companyProfile.currentYear =
          data.companyProfile.currentYear;
        return doc.update(this.form_data).then(() => {
          this.router.navigate(['overview']);
        });
      } else {
        this.form_data.companyProfile.currentYear = this.currentYear.getFullYear();
        return doc.update(this.form_data).then(() => {
          doc.update({completedProfile: true});
          this.router.navigate(['overview']);
        });
      }
    });
    // return userRef.set(this.form_data, {
    //   merge: true
    // });
  }
}
