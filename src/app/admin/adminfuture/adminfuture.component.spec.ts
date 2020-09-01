import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminfutureComponent } from './adminfuture.component';

describe('AdminfutureComponent', () => {
  let component: AdminfutureComponent;
  let fixture: ComponentFixture<AdminfutureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminfutureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminfutureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
