import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { LocalityService } from './locality.service';

describe('LocalityService', () => {
  let service: LocalityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(LocalityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
