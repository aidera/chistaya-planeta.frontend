import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { TablePageComponent } from './table-page.component';
import { ConverterService } from '../../services/converter/converter.service';
import { SocketIoService } from '../../services/socket-io/socket-io.service';
import { routes } from '../../app-routing.module';
import { OptionsService } from '../../services/options/options.service';
import { HttpClientModule } from '@angular/common/http';

describe('TablePageComponent', () => {
  let component: TablePageComponent;
  let fixture: ComponentFixture<TablePageComponent>;
  let location: Location;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablePageComponent],
      providers: [
        SocketIoService,
        OptionsService,
        { provide: ConverterService },
        provideMockStore({
          initialState: {
            app: {
              localitiesToSelect: null,
              divisionsToSelect: null,
              carsToSelect: null,
              employeesToSelect: null,
            },
            users: {
              user: null,
              type: null,
            },
          },
        }),
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        MatSnackBarModule,
        HttpClientModule,
      ],
    }).compileComponents();

    location = TestBed.inject(Location);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(TablePageComponent);
    fixture.ngZone.run(() => {
      router.initialNavigation();
      component = fixture.debugElement.componentInstance;
      component.tableColumns = [
        {
          key: 'id',
          title: 'Идентификатор',
          isSorting: true,
        },
        {
          key: 'status',
          title: 'Статус',
          isSorting: false,
        },
      ];
      component.columnsCanBeDisplayed = ['id', 'status'];
      component.displayedColumns = ['id', 'status'];
      component.createAdvancedSearchForm = () => {
        return new FormGroup({
          name: new FormControl(''),
          status: new FormControl([]),
          dateFrom: new FormControl(''),
          dateTo: new FormControl(''),
        });
      };
      component.onTableRequest = () => {};
      fixture.detectChanges();
    });
  });

  describe('common', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should update vars correctly if setInitialRequestSettings is called', async(() => {
      fixture.ngZone.run(() => {
        component.ngOnInit();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.tablePagination.page).toBe(1);
          expect(component.tableSorting).toBe(undefined);
          expect(component.quickSearchForm.valid).toEqual(
            component.quickSearchForm.valid
          );
          expect(component.advancedSearchForm.valid).toEqual(
            component.advancedSearchForm.valid
          );
        });
      });
    }));
  });

  describe('forms', () => {
    it('should define advancedSearchForm at the ngOnInit hook', async(() => {
      fixture.ngZone.run(() => {
        component.ngOnInit();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.advancedSearchForm).toBeDefined();
        });
      });
    }));

    it('should set current form correctly', async(() => {
      fixture.ngZone.run(() => {
        component.setCurrentForm('quick');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.currentForm).toBe('quick');

          component.setCurrentForm('advanced');
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(component.currentForm).toBe('advanced');
          });
        });
      });
    }));

    it('should set initial settings if we change a current form', async(() => {
      fixture.ngZone.run(() => {
        component.setCurrentForm('quick');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.tablePagination.page).toBe(1);
          expect(component.tableSorting).toBe(undefined);
          expect(component.quickSearchForm.valid).toEqual(
            component.quickSearchForm.valid
          );
          expect(component.advancedSearchForm.valid).toEqual(
            component.advancedSearchForm.valid
          );
        });
      });
    }));

    it('should add search query param if the search field is not empty', async(() => {
      fixture.ngZone.run(() => {
        component.setCurrentForm('quick');
        fixture.detectChanges();
        component.quickSearchForm.get('search').setValue('хаб');
        fixture.whenStable().then(() => {
          expect(decodeURIComponent(location.path())).toContain('search=хаб');
        });
      });
    }));

    it('should remove search query param if the search field becomes empty', async(() => {
      fixture.ngZone.run(() => {
        component.setCurrentForm('quick');
        fixture.detectChanges();
        component.quickSearchForm.get('search').setValue('хаб');
        fixture.detectChanges();
        component.quickSearchForm.get('search').setValue('');
        fixture.whenStable().then(() => {
          expect(decodeURIComponent(location.path())).not.toContain('search=');
        });
      });
    }));

    it('should add filter query param if one of the fields is not empty', async(() => {
      fixture.ngZone.run(() => {
        component.setCurrentForm('advanced');
        fixture.detectChanges();
        component.advancedSearchForm.get('status').setValue(['true']);
        fixture.whenStable().then(() => {
          expect(decodeURIComponent(location.path())).toContain(
            'filter__status=true'
          );
        });
      });
    }));

    it('should remove filter query param if all filter fields become empty', async(() => {
      fixture.ngZone.run(() => {
        component.setCurrentForm('advanced');
        fixture.detectChanges();
        component.advancedSearchForm.get('status').setValue(['true']);
        fixture.detectChanges();
        component.advancedSearchForm.get('status').setValue('');
        fixture.whenStable().then(() => {
          expect(decodeURIComponent(location.path())).not.toContain('filter__');
        });
      });
    }));

    it('should add date filter query param', async(() => {
      fixture.ngZone.run(() => {
        component.setCurrentForm('advanced');
        fixture.detectChanges();
        component.advancedSearchForm.get('dateTo').setValue(new Date());
        fixture.whenStable().then(() => {
          expect(decodeURIComponent(location.path())).toContain(
            'filter__dateTo='
          );
        });
      });
    }));

    it('should have several filters query param', async(() => {
      fixture.ngZone.run(() => {
        component.setCurrentForm('advanced');
        fixture.detectChanges();
        component.advancedSearchForm.get('dateTo').setValue(new Date());
        component.advancedSearchForm.get('dateFrom').setValue(new Date());
        fixture.whenStable().then(() => {
          expect(decodeURIComponent(location.path())).toContain(
            'filter__dateTo='
          );
          expect(decodeURIComponent(location.path())).toContain(
            'filter__dateFrom='
          );
        });
      });
    }));

    it('should have only filters query param if there are search and filter values', async(() => {
      fixture.ngZone.run(() => {
        component.setCurrentForm('advanced');
        fixture.detectChanges();
        component.advancedSearchForm.get('status').setValue(['true']);
        component.quickSearchForm.get('search').setValue('хаб');
        fixture.whenStable().then(() => {
          expect(decodeURIComponent(location.path())).toContain('status=true');
          expect(decodeURIComponent(location.path())).not.toContain('search=');
        });
      });
    }));

    it('should add sortField and sortType if there is a sorting', async(() => {
      fixture.ngZone.run(() => {
        component.onTableSort({ type: 'asc', field: 'status' });
        fixture.detectChanges();

        // I don't know why the top lines don't want to work without these
        component.quickSearchForm.get('search').setValue('1');
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(decodeURIComponent(location.path())).toContain(
            'sortingField=status'
          );
          expect(decodeURIComponent(location.path())).toContain(
            'sortingType=asc'
          );
        });
      });
    }));
  });

  describe('table', () => {
    it('should set new displayed columns if onTableDisplay is called', () => {
      component.onTableDisplay(['id']);
      fixture.detectChanges();

      expect(component.displayedColumns).toEqual(['id']);
    });

    it('should not touch columnsCanBeDisplayed if onTableDisplay is called', () => {
      const prevValue = component.columnsCanBeDisplayed;
      component.onTableDisplay(['id']);
      fixture.detectChanges();

      expect(component.columnsCanBeDisplayed).toEqual(prevValue);
    });

    it('should set new sort if onTableSort is called', async(() => {
      fixture.ngZone.run(() => {
        component.onTableSort({ type: 'asc', field: 'name' });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.tableSorting).toEqual({
            type: 'asc',
            field: 'name',
          });
        });
      });
    }));

    it('should set new pagination if onTablePaginate is called', async(() => {
      fixture.ngZone.run(() => {
        component.tablePagination = {
          page: 1,
          totalPagesCount: 4,
          totalItemsCount: 38,
          perPage: 10,
        };
        component.onTablePaginate(2);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.tablePagination).toEqual({
            page: 2,
            totalPagesCount: 4,
            totalItemsCount: 38,
            perPage: 10,
          });
        });
      });
    }));

    it('should call onTableRequest if sendRequest is called', () => {
      const onTableRequestSpy = spyOn(component, 'onTableRequest');
      component.sendRequest(true);
      fixture.detectChanges();

      expect(onTableRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onTableRequest with filters if sendRequest is called and createServerRequestFilter is defined', () => {
      const onTableRequestSpy = spyOn(component, 'onTableRequest');
      component.tablePagination = {
        page: 3,
        totalPagesCount: 4,
        totalItemsCount: 38,
        perPage: 10,
      };
      component.createServerRequestFilter = () => {
        return {
          name: 'leo',
        };
      };
      component.currentForm = 'advanced';
      component.sendRequest(true);
      fixture.detectChanges();

      expect(onTableRequestSpy).toHaveBeenCalledTimes(1);
      expect(onTableRequestSpy).toHaveBeenCalledWith(
        {
          pagination: { page: 3 },
          filter: { name: 'leo' },
          search: undefined,
          sorting: undefined,
        },
        true
      );
    });
  });
});
