import { TestBed } from '@angular/core/testing';

import { HttpinjectService } from './httpinject.service';

describe('HttpinjectService', () => {
  let service: HttpinjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpinjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
