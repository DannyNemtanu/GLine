import {
  TestBed,
  async,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {
  RouterTestingModule
} from '@angular/router/testing';
import {
  AppComponent
} from './app.component';
import {
  Router
} from '@angular/router';
import {
  Location
} from '@angular/common';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

describe('AppComponent', () => {
  let router: Router;
  let location: Location;
  let fixture;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
    it('should be true if true', () => {
      expect(true).toBe(true);
    });
    it('starting path should be', fakeAsync(() => {
      router.navigate(['']);
      tick();
      expect(location.path()).toBe('/something');
    }));
  });
});
