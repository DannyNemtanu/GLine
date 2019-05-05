import {
  ChatService
} from 'src/app/shared/directives/chat.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  UserDataService
} from './../services/user-data.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  User
} from '../shared/services/user';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-company-overview',
  templateUrl: './company-overview.component.html',
  styleUrls: ['./company-overview.component.scss']
})
export class CompanyOverviewComponent implements OnInit {
  retailer: boolean;
  isLoaded = false;
  id;
  cInfo: any;
  currentYear = new Date().getFullYear();
  yearsInBusiness: any;
  messageForm: FormGroup;
  messageValidation = {
    message: [{
        type: 'required',
        message: 'Title is required!'
      },
      {
        type: 'pattern',
        message: 'Please remove prohhibited characters!'
      },
    ]
  };
  constructor(
    private userService: UserDataService,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private us: UserDataService,
    private chat: ChatService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.messageForm = this.fb.group({
      message: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9-/\.:\r?\n()%?!@|&€#*$"', ]*$/)
        ])
      ]
    });
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getInfo(this.id);
    });
    this.setUserType();
    // this.userData(this.userService.getUserID());
  }
  getInfo(id) {
    const doc = this.afs.doc(`users/${id}`);
    doc.valueChanges().subscribe(data => {
      this.cInfo = data.companyProfile;
      const years = this.currentYear - data.companyProfile.currentYear;
      if (years === 0) {
        this.yearsInBusiness = 1;
      } else {
        this.yearsInBusiness = years;
      }
      this.isLoaded = true;
    });
  }
  setUserType() {
    const query = this.afs
      .collection < User > ('users', ref =>
        ref.where('uid', '==', this.userService.getUserID())
      )
      .valueChanges();
    query.subscribe(snapshot => {
      if (snapshot[0].retailer) {
        this.retailer = true;
      } else {
        this.retailer = false;
      }
    });
  }
  contactSupplier(event, supplierId) {
    // Data
    const clientId = this.us.getUserID();
    const data = {
      receiver: supplierId,
      createdAt: Date.now(),
      chatId: supplierId + clientId
    };
    const supplier = {
      receiver: clientId,
      createdAt: Date.now(),
      chatId: supplierId + clientId
    };
    // Init Connections
    this.afs.collection(`users/${clientId}/connections`, ref => ref.where('receiver', '==', `${supplierId}`))
      .valueChanges().subscribe(doc => {
        if (doc.length === 0) {
          this.afs.collection(`users/${clientId}/connections`).add(data).then(() => {
            this.afs.collection(`users/${supplierId}/connections`).add(supplier).then(() => {
              this.chat.setSource(supplierId, clientId);
              this.router.navigate(['messenger', supplierId + clientId]);
            });
          });
        } else {
          this.chat.setSource(supplierId, clientId);
          this.router.navigate(['messenger', supplierId + clientId]);
        }
      });
    event.stopPropagation();
  }

  async create() {
    const chatId = this.id + this.us.getUserID();
    const data = {
      sid: this.id,
      cid: this.us.getUserID(),
      createdAt: Date.now(),
      chatID: chatId
    };
    const chatRef = this.afs.doc(`chats/${chatId}`);
    chatRef.valueChanges().subscribe(doc => {
      if (doc) {
        this.sendMessage(chatId, this.messageForm.get('message').value);
      } else {
        chatRef.set(data).then(() => {
          this.sendMessage(chatId, this.messageForm.get('message').value);
        });
      }
    });
  }
  async sendMessage(chatId, content) {
    const uid = this.us.getUserID();
    if (this.messageForm.valid) {
      const data = {
        uid,
        content,
        createdAt: Date.now()
      };
      this.afs.collection(`chats/${chatId}/messages`).add(data).then(() => {
        this.messageForm.patchValue({
          message: ''
        });
      });
    }
  }
}
