import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerSingleComponent } from './retailer-single.component';

describe('RetailerSingleComponent', () => {
  let component: RetailerSingleComponent;
  let fixture: ComponentFixture<RetailerSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
