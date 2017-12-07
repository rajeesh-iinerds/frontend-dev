import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorMarkupComponent } from './distributor-markup.component';

describe('DistributorMarkupComponent', () => {
  let component: DistributorMarkupComponent;
  let fixture: ComponentFixture<DistributorMarkupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorMarkupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorMarkupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
