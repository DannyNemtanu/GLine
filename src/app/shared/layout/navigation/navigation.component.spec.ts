import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  NavigationComponent
} from './navigation.component';
import {
  DebugElement
} from '@angular/core';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture < NavigationComponent > ;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
        declarations: [NavigationComponent]
      })
      .compileComponents();
  }));
  
  afterAll(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
  });

});
