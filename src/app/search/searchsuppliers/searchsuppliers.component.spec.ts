import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchsuppliersComponent } from './searchsuppliers.component';

describe('SearchsuppliersComponent', () => {
  let component: SearchsuppliersComponent;
  let fixture: ComponentFixture<SearchsuppliersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchsuppliersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchsuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
