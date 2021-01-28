import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { TablePageComponent } from './table-page.component';
import { ConverterService } from '../../services/converter/converter.service';

describe('TablePageComponent', () => {
  let component: TablePageComponent;
  let fixture: ComponentFixture<TablePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablePageComponent],
      providers: [
        { provide: ConverterService },
        provideMockStore({
          initialState: {},
        }),
      ],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TablePageComponent);
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
        status: new FormControl(['true', 'false']),
      });
    };
    component.onTableRequest = () => {};
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not create the component if tableColumns is not defined', () => {
    component.tableColumns = undefined;
    expect(() => component.ngOnInit()).toThrowError();
  });

  it('should not create the component if createAdvancedSearchForm is not defined', () => {
    component.createAdvancedSearchForm = undefined;
    expect(() => component.ngOnInit()).toThrowError();
  });

  it('should not create the component if displayedColumns is not defined', () => {
    component.displayedColumns = undefined;
    expect(() => component.ngOnInit()).toThrowError();
  });

  it('should not create the component if columnsCanBeDisplayed is not defined', () => {
    component.columnsCanBeDisplayed = undefined;
    expect(() => component.ngOnInit()).toThrowError();
  });

  it('should define advancedSearchForm at the ngOnInit hook', () => {
    component.ngOnInit();
    expect(component.advancedSearchForm).toBeDefined();
  });

  it('should update vars correctly if setInitialRequestSettings is called', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.tablePagination.page).toBe(1);
    expect(component.tableSorting).toBe(undefined);
    expect(component.quickSearchValue).toBe(undefined);
    expect(component.advancedSearchForm.valid).toEqual(
      component.advancedSearchForm.valid
    );
  });

  it('should set current form correctly', () => {
    component.setCurrentForm('quick');
    fixture.detectChanges();

    expect(component.currentForm).toBe('quick');

    component.setCurrentForm('advanced');
    fixture.detectChanges();

    expect(component.currentForm).toBe('advanced');
  });

  it('should set initial settings if we change a current form', () => {
    component.setCurrentForm('quick');
    fixture.detectChanges();

    expect(component.tablePagination.page).toBe(1);
    expect(component.tableSorting).toBe(undefined);
    expect(component.quickSearchValue).toBe(undefined);
    expect(component.advancedSearchForm.valid).toEqual(
      component.advancedSearchForm.valid
    );
  });

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

  it('should set new sort if onTableSort is called', () => {
    component.onTableSort({ type: 'asc', field: 'name' });
    fixture.detectChanges();

    expect(component.tableSorting).toEqual({ type: 'asc', field: 'name' });
  });

  it('should set new pagination if onTablePaginate is called', () => {
    component.tablePagination = {
      page: 1,
      totalPagesCount: 4,
      totalItemsCount: 38,
      perPage: 10,
    };
    component.onTablePaginate(2);
    fixture.detectChanges();

    expect(component.tablePagination).toEqual({
      page: 2,
      totalPagesCount: 4,
      totalItemsCount: 38,
      perPage: 10,
    });
  });

  it('should call onTableRequest if sendRequest is called', () => {
    const onTableRequestSpy = spyOn(component, 'onTableRequest');
    component.sendRequest();
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
    component.sendRequest();
    fixture.detectChanges();

    expect(onTableRequestSpy).toHaveBeenCalledTimes(1);
    expect(onTableRequestSpy).toHaveBeenCalledWith({
      pagination: { page: 3 },
      filter: { name: 'leo' },
      search: undefined,
      sorting: undefined,
    });
  });
});
