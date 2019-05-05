import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  UserDataService
} from './../services/user-data.service';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  ChatService
} from './../shared/directives/chat.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit {
  currentUser;
  isRetailer;
  supplierID;
  clientID;
  chatID;
  lastMessage;
  userConnections: Array < any > = [];
  supplierConnections: Array < any > = [];
  source: any;
  supplierData: any;
  retailerData: any;
  sidValid = false;
  cidValid = false;
  messenger: any;
  isMessage = false;
  supplierProfileImage = '';
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
    private route: ActivatedRoute,
    private chatService: ChatService,
    private afs: AngularFirestore,
    private us: UserDataService,
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
    this.currentUser = this.us.getUserID();
    this.route.params.subscribe(params => {
      this.chatID = params['chatid'];
    });
    this.source = this.chatService.getSource();
    this.clientID = this.source.cid;
    this.supplierID = this.source.sid;
    this.checkChat(this.chatID);
    this.loadConnections(this.currentUser);
    this.showMessages(this.chatID);
  }

  onKeydown() {
    this.sendMessage(this.chatID, this.messageForm.get('message').value);
  }

  loadConnections(currentUser) {
    this.afs.doc(`users/${currentUser}`).valueChanges().subscribe(user => {
      this.isRetailer = user.retailer;
      this.afs.collection(`users/${currentUser}/connections`).valueChanges().subscribe(connections => {
        connections.forEach(con => {
          this.afs.doc(`users/${con.receiver}`).valueChanges().subscribe(conData => {
            if (this.isRetailer) {
              const supplierID = con.receiver;
              this.afs.collection(`chats/${supplierID + currentUser}/messages`,
                ref => ref.orderBy('createdAt', 'asc')).valueChanges().subscribe(data => {
                this.lastMessage = data[data.length - 1];
                this.isMessage = true;
                console.log(this.lastMessage);
              });
              this.userConnections.push(conData);
              console.log(this.userConnections);
            } else {
              const retailerID = con.receiver;
              this.supplierConnections.push(conData);
              console.log(this.supplierConnections);
              this.afs.collection(`chats/${currentUser+ retailerID}/messages`,
                ref => ref.orderBy('createdAt', 'asc')).valueChanges().subscribe(data => {
                this.lastMessage = data[data.length - 1];
                this.isMessage = true;
                console.log(this.lastMessage);
              });
            }
          });
        });
      });
    });
  }

  checkChat(chatid) {
    this.afs.doc(`chats/${chatid}`).valueChanges().subscribe(data => {
      if (data) {
        this.showData(chatid);
      } else {
        if (chatid !== this.us.getUserID()) {
          this.create(chatid);
        }
      }
    });
  }

  async create(chatid) {
    const data = {
      sid: this.supplierID,
      cid: this.clientID,
      createdAt: Date.now(),
      chatID: this.chatID
    };
    this.afs.doc(`chats/${chatid}`).set(data).then(() => {
      this.showData(chatid);
    });
  }
  chatPerson($event, currentUser, retaileruid) {
    if (this.isRetailer) {

    } else {

    }
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
        this.showMessages(chatId);
      });
    }
  }
  showMessages(id) {
    this.afs.collection(`chats/${id}/messages`, ref => ref.orderBy('createdAt', 'asc')).valueChanges().subscribe(messages => {
      this.messenger = messages;
      console.log(this.messenger);
      this.messageForm.patchValue({
        message: ''
      });
    });
  }
  showData(id) {
    console.log('Chat ID:  ' + id);
    this.afs.doc(`chats/${id}`).valueChanges().subscribe(chatData => {
      if (chatData) {
        if (chatData.cid === this.us.getUserID()) { // Retailer side messeger
          this.afs.doc(`users/${chatData.sid}`).valueChanges().subscribe(data => {
            this.supplierData = data;
            this.supplierProfileImage = this.supplierData.companyProfile.profilePicture;
            this.sidValid = true;
          });
        } else { // Supplier side messenger
          this.afs.doc(`users/${chatData.cid}`).valueChanges().subscribe(data => {
            console.log(data);
            this.retailerData = data;
            this.cidValid = true;
            console.log('Not enough client data!');
          });
        }
      } else {
        console.log('There is no data!');
      }
    });
  }

  changeChat(first, second) {
    this.router.navigate(['messenger', first + second]).then(() => {
      this.showMessages(first + second);
    });
  }

}
