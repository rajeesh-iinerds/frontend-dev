import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorCategoryComponent } from './distributor-category.component';

describe('DistributorCategoryComponent', () => {
  let component: DistributorCategoryComponent;
  let fixture: ComponentFixture<DistributorCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
