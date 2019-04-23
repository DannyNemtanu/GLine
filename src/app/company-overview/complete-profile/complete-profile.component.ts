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
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {
  // Image Uplaod
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  uploadStatus = 'Not Uploaded';
  uploadProgress: any = 0;

  // FORM PROGRESS STEPS
  progressOne = 'uncompleted';
  progressTwo = 'uncompleted';
  progressThree = 'uncompleted';
  progressFour = 'uncompleted';
  progressFive = 'uncompleted';

  start_step = 1;
  step: string;
  form_data = {
    companyProfile: {
      profilePicture: '',
      tradingName: '',
      registrationNumber: '',
      establishedDate: {
        day: '',
        month: '',
        year: ''
      },
      websiteURL: '',
      pyshicalAddress: '',
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

  constructor(
    private afs: AngularFirestore,
    private user: UserDataService,
    private afStorage: AngularFireStorage
  ) {}

  ngOnInit() {
    // Starting form
    this.step = 'one';
  }

  // Upload Profile Picture
  startUpload(event: FileList) {
    const uid = this.user.getUserID();
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.log('Please upload an valid iamge!');
      return;
    }

    // Storage path
    const path = `${uid}/profilePicture`;
    this.task = this.afStorage.upload(path, file);

    this.task.percentageChanges().subscribe(data => {
      this.uploadProgress = data.toFixed();
    });

    this.snapshot = this.task.snapshotChanges();
    console.log(this.snapshot);
    this.task.snapshotChanges().subscribe(snap => {
      if (snap.bytesTransferred === snap.totalBytes) {
        this.uploadStatus = 'Uploaded';
        this.form_data.companyProfile.profilePicture = path;
      }
    });
  }

  // Continue to next step
  next() {
    this.start_step = this.start_step + 1;
    this.changeState(this.start_step);
    console.log(this.form_data);
  }

  // Change Form State
  changeState(num) {
    console.log(this.step);
    // Checking Swithc Statement
    if (num === 1) {
      this.step = 'one';
      this.progressOne = 'active';
    }
    if (num === 2) {
      this.step = 'two';
      this.progressOne = 'completed';
      this.progressTwo = 'active';
    }
    if (num === 3) {
      this.step = 'three';
      this.progressOne = 'completed';
      this.progressTwo = 'completed';
      this.progressThree = 'active';
    }
    if (num === 4) {
      this.step = 'four';
      this.progressOne = 'completed';
      this.progressTwo = 'completed';
      this.progressThree = 'completed';
      this.progressFour = 'active';
    }
    if (num === 5) {
      this.step = 'five';
      this.progressOne = 'completed';
      this.progressTwo = 'completed';
      this.progressThree = 'completed';
      this.progressFour = 'completed';
      this.progressFive = 'active';
    }
    // Making Changes on progress
    console.log(this.form_data);
  }

  setFormData(form_data) {
    this.form_data = {
      ...this.form_data,
      ...form_data
    };
    console.log('next', this.form_data);
  }

  finishAction() {
    console.log(this.form_data);
  }

  // Updating the company prfile
  completeProfile() {
    const user = this.user.getUserID();
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user}`
    );
    return userRef.update(this.form_data);
    // return userRef.set(this.form_data, {
    //   merge: true
    // });
  }
}
