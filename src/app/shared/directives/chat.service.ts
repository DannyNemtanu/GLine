import { MessengerComponent } from './../../messenger/messenger.component';
import {
  Injectable
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  sourceArray = {
    sid: '',
    cid: ''
  };
  supplierSource: string;
  clientSource: string;
  constructor(
  ) {}

  setSource(sid: string, cid: string) {
    this.supplierSource = sid;
    this.clientSource = cid;
  }
  getSource() {
    return this.sourceArray = {
      sid: this.supplierSource,
      cid: this.clientSource
    };
  }

}
