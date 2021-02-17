import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';

import { OptionsService } from './options.service';

describe('OptionsService', () => {
  let service: OptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        provideMockStore({
          initialState: {
            app: {
              localitiesToSelect: null,
              divisionsToSelect: null,
              carsToSelect: null,
              employeesToSelect: null,
            },
          },
        }),
      ],
    });
    service = TestBed.inject(OptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
