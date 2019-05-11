// Main
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule,
  ErrorHandler
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  CommonModule
} from '@angular/common';
import {
  AppRoutingModule
} from './app-routing.module';
import {
  AppComponent
} from './app.component';
import * as CryptoJS from 'crypto-js';

// Firestore
import {
  AngularFireModule
} from '@angular/fire';
import {
  AngularFireAuthModule
} from '@angular/fire/auth';
import {
  AngularFirestoreModule
} from '@angular/fire/firestore';
import {
  environment
} from '../environments/environment';

// Components
import {
  SignInComponent
} from './authentication/sign-in/sign-in.component';
import {
  SignUpComponent
} from './authentication/sign-up/sign-up.component';
import {
  ForgotPasswordComponent
} from './authentication/forgot-password/forgot-password.component';
import {
  VerifyEmailComponent
} from './authentication/verify-email/verify-email.component';
import {
  NgbModule
} from '@ng-bootstrap/ng-bootstrap';

// Auth service
import {
  AuthService
} from './shared/services/auth.service';
import {
  DashboardComponent
} from './dashboard/dashboard.component';
import {
  NavigationComponent
} from './shared/layout/navigation/navigation.component';
import {
  HomeComponent
} from './dashboard/home/home.component';
import {
  ProductComponent
} from './product/product.component';
import {
  SingleProductComponent
} from './product/single-product/single-product.component';
import {
  CompanyOverviewComponent
} from './company-overview/company-overview.component';
import {
  MessengerComponent
} from './messenger/messenger.component';
import {
  CompleteProfileComponent
} from './company-overview/complete-profile/complete-profile.component';
import {
  AngularFireStorageModule
} from 'angularfire2/storage';
import {
  HttpClientModule
} from '@angular/common/http';
import {
  DropZoneDirective
} from './shared/directives/drop-zone.directive';
import {
  AllproductsComponent
} from './product/allproducts/allproducts.component';
import {
  AddnewComponent
} from './product/allproducts/addnew/addnew.component';
import {
  EditProductComponent
} from './product/allproducts/edit-product/edit-product.component';
import {
  SuppliersComponent
} from './suppliers/suppliers.component';
import {
  SearchproductsComponent
} from './search/searchproducts/searchproducts.component';
import {
  SearchsuppliersComponent
} from './search/searchsuppliers/searchsuppliers.component';
import {
  RfqComponent
} from './rfq/rfq.component';
import {
  ListComponent
} from './rfq/list/list.component';
import {
  EditrfqComponent
} from './rfq/editrfq/editrfq.component';
import {
  GoogleAnalyticsService
} from './services/google-analytics.service';
import {
  GlobalErrorHandler
} from './logging/global-error-handling';
import {
  LogsComponent
} from './logging/logs/logs.component';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    DashboardComponent,
    NavigationComponent,
    HomeComponent,
    ProductComponent,
    SingleProductComponent,
    CompanyOverviewComponent,
    MessengerComponent,
    CompleteProfileComponent,
    DropZoneDirective,
    AllproductsComponent,
    AddnewComponent,
    EditProductComponent,
    SuppliersComponent,
    SearchproductsComponent,
    SearchsuppliersComponent,
    RfqComponent,
    ListComponent,
    EditrfqComponent,
    LogsComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, GoogleAnalyticsService,
    // {
    //   provide: ErrorHandler,
    //   useClass: GlobalErrorHandler
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  // @reference https://filipmolcik.com/google-analytics-%F0%9F%93%88-in-angular-2-app-example/
  constructor(protected _googleAnalyticsService: GoogleAnalyticsService) {} // < --We inject the service here to keep it alive whole time

}
