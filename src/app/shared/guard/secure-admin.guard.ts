import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserDataService } from 'src/app/services/user-data.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SecureAdminGuard implements CanActivate {
  constructor(
    private userData: UserDataService,
    private afs: AngularFirestore,
    public router: Router

  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable < boolean > | Promise < boolean > | boolean {
    const currentUser = this.userData.getUserID();
    this.afs.doc(`users/${currentUser}`).valueChanges().subscribe((user: any) => {
      if (!user.admin) {
        this.router.navigate(['sign-in']);
      }
    });
    return true;
  }
}
