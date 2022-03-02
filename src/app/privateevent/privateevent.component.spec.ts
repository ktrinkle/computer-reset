import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateeventComponent } from './privateevent.component';

describe('PrivateeventComponent', () => {
  let component: PrivateeventComponent;
  let fixture: ComponentFixture<PrivateeventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateeventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
