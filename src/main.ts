import {
  GlobalErrorHandler
} from './app/logging/global-error-handling';
import {
  enableProdMode
} from '@angular/core';
import {
  platformBrowserDynamic
} from '@angular/platform-browser-dynamic';

import {
  AppModule
} from './app/app.module';
import {
  environment
} from './environments/environment';

if (environment.production) {
  enableProdMode();
}
// tslint:disable-next-line:max-line-length
// @reference https://www.codementor.io/brijmcq/angular-clear-all-of-your-console-logs-in-production-build-with-just-a-few-lines-of-code-cxcw30yqs
if (console.warn) {
  window.console.warn = function () {};
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
