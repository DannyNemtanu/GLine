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
  cd: Date;

  constructor(private afs: AngularFirestore) {}
  // @reference https://stackoverflow.com/questions/3925248/print-python-stack-trace-without-exception-being-raised
  ngOnInit() {
    this.afs.collection('logging', ref => ref.orderBy('createdAt', 'desc').limit(10)).valueChanges().subscribe(error => {
      console.log('%cApplication Logging Bellow', 'color:red');
      error.forEach((clog: any, index) => {
        console.log('\n\n\n');
        console.log('%c< ====================   Error: ' + (index + 1) + '   ==================== >', 'color: #333; font-weight:bold;');
        const date = new Date(`${clog.createdAt}`).toLocaleDateString();
        const time = new Date(`${clog.createdAt}`).toLocaleTimeString();
        console.log('%cCreated: ' + '%c' + date + ' ' + time, 'color:green; font-weight:bold', 'color:red');
        console.log('%cMessage: ' + '%c' + clog.message, 'color:green; font-weight:bold', 'color:red');
        console.log('%cURL: ' + '%c' + clog.url, 'color:green; font-weight:bold', 'color:red');
        console.log('%cStackTrace: ' + '%c' + clog.location, 'color:green; font-weight:bold', 'color:red');
      });
    });
  }
}
