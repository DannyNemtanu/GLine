import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditrfqComponent } from './editrfq.component';

describe('EditrfqComponent', () => {
  let component: EditrfqComponent;
  let fixture: ComponentFixture<EditrfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditrfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditrfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
