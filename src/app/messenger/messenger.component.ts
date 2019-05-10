import * as CryptoJS from 'crypto-js';
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
  // supplierConnections: Array < any > = [];
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
    this.afs.doc(`users/${currentUser}`).valueChanges().subscribe((user: any) => {
      this.isRetailer = user.retailer; // Checking if retailer for choosing what to display
      this.afs.collection(`users/${currentUser}/connections`).valueChanges().subscribe(connections => {
        connections.forEach((con: any) => {
          this.afs.doc(`users/${con.receiver}`).valueChanges().subscribe(conData => {
            this.afs.collection(`chats/${con.chatId}/messages`,
              ref => ref.orderBy('createdAt', 'asc')).valueChanges().subscribe(data => {
              this.lastMessage = data[data.length - 1];
              this.isMessage = true;
            });
            this.userConnections.push(conData);
          });
        });
      });
    });
  }

  checkChat(chatid) {
    try {
      this.afs.doc(`chats/${chatid}`).valueChanges().subscribe(data => {
        if (data) {
          this.showData(chatid);
        } else {
          if (chatid !== this.us.getUserID()) {
            this.create(chatid);
          }
        }
      });
    } catch (e) {
      throw new Error(`Chat could not be found: ${chatid} by the \n USER: ${this.currentUser}`);
    }
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

  async sendMessage(chatId, content) {
    const uid = this.us.getUserID();
    if (this.messageForm.valid) {
      const data = {
        uid,
        content: this.encryptData(content),
        createdAt: Date.now()
      };
      try {
        this.afs.collection(`chats/${chatId}/messages`).add(data).then(() => {
          this.showMessages(chatId);
        });
      } catch (e) {
        throw new Error(`Could not upload message to database`);
      }
    } else {
      throw new Error(`Sending Message: ${this.messageForm.value}`);
    }
  }
  showMessages(id) {
    this.messenger = new Array;
    try {
      this.afs.collection(`chats/${id}/messages`, ref => ref.orderBy('createdAt', 'asc')).valueChanges().subscribe(messages => {
        messages.forEach(message => {
          this.messenger = messages;
        });
        this.messageForm.patchValue({
          message: ''
        });
      });
    } catch (e) {
      throw new Error('Sowing messages failed!');
    }
    // console.log(this.decryptData(data.content, data.uid););
  }


  // Encryption & Decryption using AES
  encryptData(data) {
    try {
      const chipertext = CryptoJS.AES.encrypt(data, this.currentUser);
      // console.log(chipertext.toString());
      return chipertext.toString();
    } catch (e) {
      throw new Error('Data encrytion failed!');
    }
  }
  decryptData(chipertext, sender) {
    try {
      const bytes = CryptoJS.AES.decrypt(chipertext.toString(), sender);
      const plaintext = bytes.toString(CryptoJS.enc.Utf8);
      return plaintext;
    } catch {
      throw new Error('Data decryption failed!');
    }
  }


  showData(id) {
    // console.log('Chat ID:  ' + id);
    this.afs.doc(`chats/${id}`).valueChanges().subscribe((chatData: any) => {
      if (chatData) {
        if (chatData.cid === this.us.getUserID()) { // Retailer side messeger
          this.afs.doc(`users/${chatData.sid}`).valueChanges().subscribe(data => {
            this.supplierData = data;
            this.supplierProfileImage = this.supplierData.companyProfile.profilePicture;
            this.sidValid = true;
          });
        } else { // Supplier side messenger
          this.afs.doc(`users/${chatData.cid}`).valueChanges().subscribe((data: any) => {
            // console.log(data);
            this.retailerData = data;
            this.cidValid = true;
            // console.log('Not enough client data!');
          });
        }
      } else {
        throw new Error(`Data could not be found ${this.currentUser}`);
      }
    });
  }

  // Changing display information on user click
  changeChat(first, second) {
    this.router.navigate(['messenger', first + second]).then(() => {
      this.showMessages(this.chatID);
      this.showData(this.chatID);
    });
  }

}
