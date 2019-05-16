import * as CryptoJS from 'crypto-js';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  AngularFirestore
} from '@angular/fire/firestore';

import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  ChatService
} from 'src/app/services/chat.service';
import {
  UserDataService
} from 'src/app/services/user-data.service';

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
  lastMessage: Array < any > = [];
  userConnections: Array < any > = [];
  displayRetailerName: string;
  showName = false;
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
          Validators.required
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
    this.showMessages(this.chatID);
    this.loadConnections(this.currentUser);
  }

  onKeydown() {
    this.sendMessage(this.chatID, this.messageForm.get('message').value);
  }

  updateLastMessages(chatId) {
    console.log(chatId);
    this.userConnections.forEach((con, index) => {
      if (chatId.includes(con.uid)) {
        console.log('Found User Chat Id');
        this.afs.collection(`chats/${chatId}/messages`, ref => ref.orderBy('createdAt', 'asc')).valueChanges().subscribe((data: any) => {
          const messages: Array < any > = data;
          this.lastMessage[index] = messages.pop();
          this.isMessage = true;
        });
      }
    });
  }

  loadConnections(currentUser) {
    for (let i = this.userConnections.length; i > 0; i--) {
      // console.log(i);
      this.lastMessage.pop();
      this.userConnections.pop();
    }
    this.afs.doc(`users/${currentUser}`).valueChanges().subscribe((user: any) => {
      this.isRetailer = user.retailer; // Checking if retailer for choosing what to display
      this.afs.collection(`users/${currentUser}/connections`).valueChanges().subscribe(connections => {
        connections.forEach((con: any) => {
          // console.log(con);
          this.afs.doc(`users/${con.receiver}`).valueChanges().subscribe(conData => {
            // console.log(conData);
            this.userConnections.push(conData);
            this.afs.collection(`chats/${con.chatId}/messages`,
              ref => ref.orderBy('createdAt', 'asc')).valueChanges().subscribe((data: any) => {
              if (data && this.lastMessage.length < this.userConnections.length) {
                this.lastMessage.push(data[data.length - 1]);
                // console.log(this.lastMessage);
                this.isMessage = true;
              }
            });
          });
        });
      });
    });
  }

  checkChat(chatid) {
    try {
      this.afs.doc(`chats/${chatid}`).valueChanges().subscribe((data: any) => {
        if (data) {
          if (data.cid === this.currentUser || data.sid === this.currentUser) {
            this.showData(chatid);
          }
        } else {
          this.create(chatid);
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
    const mockMessage = {
      uid: this.currentUser,
      createdAt: Date.now(),
      content: ''
    };
    this.afs.doc(`chats/${chatid}`).set(data).then(() => {
      this.afs.collection(`chats/${chatid}/messages`).add(mockMessage).then(() => {
        this.showData(chatid);
      });
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
      this.afs.collection(`chats/${chatId}/messages`).add(data).then(() => {
        this.showMessages(chatId);
        this.updateLastMessages(chatId);
      }).catch(() => {
        throw new Error(`Could not upload message to database`);
      });
    } else {
      throw new Error(`Sending Message: ${this.messageForm.value}`);
    }
  }
  showMessages(id) {
    this.messenger = new Array;
    try {
      this.afs.collection(`chats/${id}/messages`, ref => ref.orderBy('createdAt', 'asc')).valueChanges().subscribe(messages => {
        this.messenger = messages;
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
  // @reference https://www.c-sharpcorner.com/article/aes-encryptiondecryption-with-angular-7/
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

  // Using chatId to query db and showmessages
  showData(id) {
    // console.log('Chat ID:  ' + id);
    this.afs.doc(`chats/${id}`).valueChanges().subscribe((chatData: any) => {
      if (chatData) {
        if (chatData.cid === this.us.getUserID()) { // Retailer side messeger
          this.afs.doc(`users/${chatData.sid}`).valueChanges().subscribe((data: any) => {
            this.supplierData = data;
            this.supplierProfileImage = data.companyProfile.profilePicture;
            this.sidValid = true;
          });
        } else {
          // Supplier side messenger
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
  changeChat(first, second, displayName) {
    this.router.navigate(['messenger', first + second]).then(() => {
      this.showMessages(this.chatID);
      this.showData(this.chatID);
      this.displayRetailerName = displayName;
      this.showName = true;
    });
  }

}
