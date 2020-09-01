import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmintodayComponent } from './admintoday.component';

describe('AdmintodayComponent', () => {
  let component: AdmintodayComponent;
  let fixture: ComponentFixture<AdmintodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmintodayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmintodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
