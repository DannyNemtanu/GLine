import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  Component,
  OnInit
} from '@angular/core';


@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.afs.collection('logging', ref => ref.orderBy('createdAt', 'desc')).valueChanges().subscribe(error => {
      // console.log(error);
    });
  }
}
