import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerMarkupComponent } from './retailer-markup.component';

describe('RetailerMarkupComponent', () => {
  let component: RetailerMarkupComponent;
  let fixture: ComponentFixture<RetailerMarkupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerMarkupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerMarkupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
