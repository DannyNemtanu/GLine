import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject
} from 'rxjs';
import {
  stringify
} from '@angular/core/src/util';

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
  constructor() {}

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
