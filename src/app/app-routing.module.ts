import { SecureSupplierGuard } from './shared/guard/secure-supplier.guard';
import { SecureRetailerGuard } from './shared/guard/secure-retailer.guard';
import {
  LogsComponent
} from './logging/logs/logs.component';
import {
  EditrfqComponent
} from './rfq/editrfq/editrfq.component';
import {
  ListComponent
} from './rfq/list/list.component';
import {
  SuppliersComponent
} from './suppliers/suppliers.component';
import {
  AddnewComponent
} from './product/allproducts/addnew/addnew.component';
import {
  AllproductsComponent
} from './product/allproducts/allproducts.component';
import {
  CompanyOverviewComponent
} from './company-overview/company-overview.component';
import {
  CompleteProfileComponent
} from './company-overview/complete-profile/complete-profile.component';
import {
  MessengerComponent
} from './messenger/messenger.component';
import {
  ProductComponent
} from './product/product.component';
import {
  DashboardComponent
} from './dashboard/dashboard.component';
import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

// Required components for which route services to be activated
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

// Import canActivate guard services
import {
  SecureInnerPagesGuard
} from './shared/guard/secure-inner-pages.guard.ts.guard';
import {
  AuthGuard
} from './shared/guard/auth.guard';
import {
  SingleProductComponent
} from './product/single-product/single-product.component';
import {
  EditProductComponent
} from './product/allproducts/edit-product/edit-product.component';
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
  SecureAdminGuard
} from './shared/guard/secure-admin.guard';
import { SecureCompleteProfileGuard } from './shared/guard/secure-complete-profile.guard';

// Include route guard in routes array
export const routes: Routes = [{
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: 'verify-email-address',
    component: VerifyEmailComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: '',
    redirectTo: '/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: 'register-user',
    component: SignUpComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, SecureRetailerGuard]
  },
  {
    path: 'allproducts',
    component: AllproductsComponent,
    canActivate: [AuthGuard, SecureSupplierGuard, SecureCompleteProfileGuard]
  },
  {
    path: 'add',
    component: AddnewComponent,
    canActivate: [AuthGuard, SecureSupplierGuard, SecureCompleteProfileGuard]
  },
  {
    path: 'products',
    component: ProductComponent,
    canActivate: [AuthGuard, SecureRetailerGuard]
  },
  {
    path: 'products/:query',
    component: SearchproductsComponent,
    canActivate: [AuthGuard, SecureRetailerGuard]
  },
  {
    path: 'suppliers',
    component: SuppliersComponent,
    canActivate: [AuthGuard, SecureRetailerGuard]
  },
  {
    path: 'suppliers/:query',
    component: SearchsuppliersComponent,
    canActivate: [AuthGuard, SecureRetailerGuard]
  },
  {
    path: 'product/:user/:id',
    component: SingleProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editProduct/:user/:id',
    component: EditProductComponent,
    canActivate: [AuthGuard, SecureSupplierGuard, SecureCompleteProfileGuard]
  },
  {
    path: 'complete-profile',
    component: CompleteProfileComponent,
    canActivate: [AuthGuard, SecureSupplierGuard]
  },
  {
    path: 'overview/:id',
    component: CompanyOverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rfq',
    component: RfqComponent,
    canActivate: [AuthGuard, SecureRetailerGuard]
  },
  {
    path: 'myrequests',
    component: EditrfqComponent,
    canActivate: [AuthGuard, SecureRetailerGuard]
  },
  {
    path: 'rfqlist',
    component: ListComponent,
    canActivate: [AuthGuard, SecureSupplierGuard, SecureCompleteProfileGuard]
  },
  {
    path: 'messenger/:chatid',
    component: MessengerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'logger',
    component: LogsComponent,
    canActivate: [AuthGuard, SecureAdminGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
