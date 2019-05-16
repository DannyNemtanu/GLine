
// Main
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule, ErrorHandler} from '@angular/core';
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
} from './services/auth.service';
import {
  DashboardComponent
} from './retailer/dashboard/dashboard.component';
import {
  NavigationComponent
} from './shared/layout/navigation/navigation.component';
import {
  HomeComponent
} from './retailer/dashboard/home/home.component';
import {
  ProductComponent
} from './retailer/product/product.component';

import {
  CompanyOverviewComponent
} from './shared/layout/company-overview/company-overview.component';

import {
  AngularFireStorageModule
} from 'angularfire2/storage';
import {
  HttpClientModule} from '@angular/common/http';
import {
  DropZoneDirective
} from './shared/directives/drop-zone.directive';
import {
  AllproductsComponent
} from './supplier/allproducts/allproducts.component';
import {
  AddnewComponent
} from './supplier/addnew/addnew.component';
import {
  SuppliersComponent
} from './retailer/suppliers/suppliers.component';
import {
  SearchproductsComponent
} from './retailer/search/searchproducts/searchproducts.component';
import {
  SearchsuppliersComponent
} from './retailer/search/searchsuppliers/searchsuppliers.component';
import {
  RfqComponent
} from './retailer/rfq/rfq.component';
import {
  EditrfqComponent
} from './retailer/rfq/editrfq/editrfq.component';
import {
  GoogleAnalyticsService
} from './services/google-analytics.service';
import {
  LogsComponent
} from './logging/logs/logs.component';
import { GlobalErrorHandler } from './logging/global-error-handling';
import { SingleProductComponent } from './shared/layout/single-product/single-product.component';
import { MessengerComponent } from './shared/layout/messenger/messenger.component';
import { EditProductComponent } from './supplier/edit-product/edit-product.component';
import { CompleteProfileComponent } from './supplier/complete-profile/complete-profile.component';
import { ListComponent } from './supplier/list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    NavigationComponent,
    DashboardComponent,
    HomeComponent,
    ProductComponent,
    SingleProductComponent,
    CompanyOverviewComponent,
    DropZoneDirective,
    AllproductsComponent,
    AddnewComponent,
    SuppliersComponent,
    SearchproductsComponent,
    SearchsuppliersComponent,
    RfqComponent,
    EditrfqComponent,
    LogsComponent,
    CompanyOverviewComponent,
    MessengerComponent,
    CompleteProfileComponent,
    EditProductComponent,
    ListComponent
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
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  // @reference https://filipmolci  k.com/google-analytics-%F0%9F%93%88-in-angular-2-app-example/
  constructor(protected _googleAnalyticsService: GoogleAnalyticsService) {} // < --We inject the service here to keep it alive whole time
}
