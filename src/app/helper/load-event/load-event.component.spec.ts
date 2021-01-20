import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadEventComponent } from './load-event.component';

describe('LoadEventComponent', () => {
  let component: LoadEventComponent;
  let fixture: ComponentFixture<LoadEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
