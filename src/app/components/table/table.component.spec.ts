import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextInputComponent } from '../form-controls/text-input/text-input.component';
import { CheckboxComponent } from '../form-controls/checkbox/checkbox.component';
import { DateInputComponent } from '../form-controls/date-input/date-input.component';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { TableColumnType } from '../../models/types/TableColumnType';
import { FilterType } from '../../models/enums/FilterType';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from '../../modules/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

const mockColumnsData: TableColumnType[] = [
  {
    key: 'name',
    title: 'Имя',
    filter: {
      type: FilterType.text,
    },
  },
  {
    key: 'surname',
    title: 'Фамилия',
  },
  {
    key: 'age',
    title: 'Возраст',
    filter: {
      type: FilterType.number,
    },
  },
  {
    key: 'hobbies',
    title: 'Увлечения',
    filter: {
      type: FilterType.values,
      values: [
        {
          value: 'hobby1',
          text: 'танцы',
        },
        {
          value: 'hobby2',
          text: 'вышивание',
        },
        {
          value: 'hobby3',
          text: 'плаванье',
        },
      ],
    },
  },
  {
    key: 'birth',
    title: 'День рождения',
    filter: {
      type: FilterType.date,
    },
  },
];

const mockData: { [key: string]: any }[] = [
  {
    name: 'Jack',
    surname: 'Hopkins',
    age: 16,
    hobbies: ['hobby3'],
    birth: new Date(),
  },
  {
    name: 'Anna',
    surname: 'Frau',
    age: 43,
    hobbies: ['hobby1', 'hobby2'],
  },
  {
    name: 'Luis',
    surname: 'Nel',
    age: 23,
    hobbies: ['hobby1', 'hobby2', 'hobby3'],
  },
];

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableComponent,
        TextInputComponent,
        CheckboxComponent,
        DateInputComponent,
      ],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
        NgxMaskModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.columnsCanBeDisplayed = [
      'name',
      'surname',
      'age',
      'hobbies',
      'birth',
    ];
    component.columnsData = mockColumnsData;
    component.data = mockData;
    fixture.detectChanges();
  });

  /* ------------------- */
  /* ------ BASIC ------ */
  /* ------------------- */

  describe('basic', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should update displayedColumns variable if undefined in ngInit method and make it contain all columns', () => {
      expect(component.columnsCanBeDisplayed).toEqual(
        mockColumnsData.map((el) => el.key)
      );
    });

    it('should return all column information by its field name', () => {
      const fieldName = 'name';
      const expectedResult = {
        key: 'name',
        title: 'Имя',
        filter: {
          type: FilterType.text,
        },
      };

      expect(component.findColumnInfo(fieldName)).toEqual(expectedResult);
    });
  });

  /* ------------------------ */
  /* ------ DISPLAYING ------ */
  /* ------------------------ */

  describe('displaying', () => {
    it('should return with output all columns to display', () => {
      spyOn(component.display, 'emit');

      component.onDisplay({
        all: true,
        status: true,
      });

      expect(component.display.emit).toHaveBeenCalledTimes(1);
      expect(component.display.emit).toHaveBeenCalledWith(
        component.columnsCanBeDisplayed
      );
    });

    it('should not add a column to display, if displayedColumns is filled', () => {
      spyOn(component.display, 'emit');

      component.onDisplay({
        status: true,
        field: 'name',
      });

      expect(component.display.emit).toHaveBeenCalledTimes(0);
    });

    it('should add a new column to display with the columns info oder (check 1)', () => {
      spyOn(component.display, 'emit');

      component.displayedColumns = ['surname'];
      fixture.detectChanges();

      component.onDisplay({
        status: true,
        field: 'name',
      });

      expect(component.display.emit).toHaveBeenCalledTimes(1);
      expect(component.display.emit).not.toHaveBeenCalledWith([
        'surname',
        'name',
      ]);
      expect(component.display.emit).toHaveBeenCalledWith(['name', 'surname']);
    });

    it('should add a new column to display with the columns info oder (check 2)', () => {
      spyOn(component.display, 'emit');

      component.displayedColumns = ['name'];
      fixture.detectChanges();

      component.onDisplay({
        status: true,
        field: 'surname',
      });

      expect(component.display.emit).toHaveBeenCalledTimes(1);
      expect(component.display.emit).not.toHaveBeenCalledWith([
        'surname',
        'name',
      ]);
      expect(component.display.emit).toHaveBeenCalledWith(['name', 'surname']);
    });

    it('should remove a column to display', () => {
      spyOn(component.display, 'emit');

      component.displayedColumns = ['surname', 'name'];
      fixture.detectChanges();

      component.onDisplay({
        status: false,
        field: 'surname',
      });

      expect(component.display.emit).toHaveBeenCalledTimes(1);
      expect(component.display.emit).toHaveBeenCalledWith(['name']);
    });

    it('should return an undefined when a column is removing to display and it was just one column', () => {
      spyOn(component.display, 'emit');

      component.displayedColumns = ['surname'];
      fixture.detectChanges();

      component.onDisplay({
        status: false,
        field: 'surname',
      });

      expect(component.display.emit).toHaveBeenCalledTimes(1);
      expect(component.display.emit).toHaveBeenCalledWith(undefined);
    });

    it('should not emit a display action if values were incorrect', () => {
      spyOn(component.display, 'emit');

      component.displayedColumns = ['surname'];
      fixture.detectChanges();

      component.onDisplay({
        status: false,
      });

      expect(component.display.emit).toHaveBeenCalledTimes(0);
    });
  });

  /* --------------------- */
  /* ------ SORTING ------ */
  /* --------------------- */

  describe('sorting', () => {
    it('should emit correct sorting information with not current sorting field', () => {
      spyOn(component.sort, 'emit');

      component.onSort('name');

      expect(component.sort.emit).toHaveBeenCalledTimes(1);
      expect(component.sort.emit).toHaveBeenCalledWith({
        field: 'name',
        type: 'asc',
      });
    });

    it('should emit correct sorting information with current sorting field (check 1 - was asc)', () => {
      spyOn(component.sort, 'emit');

      component.sorting = { field: 'name', type: 'asc' };

      component.onSort('name');

      expect(component.sort.emit).toHaveBeenCalledTimes(1);
      expect(component.sort.emit).toHaveBeenCalledWith({
        field: 'name',
        type: 'desc',
      });
    });

    it('should emit correct sorting information with current sorting field (check 2 - was desc)', () => {
      spyOn(component.sort, 'emit');

      component.sorting = { field: 'name', type: 'desc' };

      component.onSort('name');

      expect(component.sort.emit).toHaveBeenCalledTimes(1);
      expect(component.sort.emit).toHaveBeenCalledWith({
        field: 'name',
        type: 'asc',
      });
    });
  });

  /* ------------------------ */
  /* ------ PAGINATION ------ */
  /* ------------------------ */

  describe('pagination', () => {
    it('should emit a correct pagination information', () => {
      spyOn(component.paginate, 'emit');

      component.onPaginate({
        length: 2334,
        pageIndex: 2,
        pageSize: 10,
        previousPageIndex: 1,
      });

      expect(component.paginate.emit).toHaveBeenCalledTimes(1);
      expect(component.paginate.emit).toHaveBeenCalledWith({
        currentPage: 2,
        perPage: 10,
        totalItemsCount: 2334,
        totalPagesCount: 234,
      });
    });
  });

  /* ------------------------ */
  /* ------ ITEM CLICK ------ */
  /* ------------------------ */

  describe('item click', () => {
    it('should emit the index of clicked item', () => {
      spyOn(component.itemClick, 'emit');

      component.onItemClick(1);

      expect(component.itemClick.emit).toHaveBeenCalledTimes(1);
      expect(component.itemClick.emit).toHaveBeenCalledWith(1);
    });
  });

  /* ---------------------- */
  /* ------ TEMPLATE ------ */
  /* ---------------------- */

  describe('template', () => {
    it('should not display active settings icon if displayedColumns is undefined', () => {
      const settingsIcon = fixture.debugElement.query(
        By.css('.cell-header__container .icon')
      ).nativeElement;
      expect(
        settingsIcon.getAttribute('ng-reflect-inline-s-v-g')
      ).not.toContain('activ');
    });

    it('should not display active settings icon if displayedColumns are all', () => {
      component.displayedColumns = [
        'name',
        'surname',
        'age',
        'hobbies',
        'birth',
      ];
      const settingsIcon = fixture.debugElement.query(
        By.css('.cell-header__container .icon')
      ).nativeElement;
      expect(
        settingsIcon.getAttribute('ng-reflect-inline-s-v-g')
      ).not.toContain('activ');
    });

    it('should display active settings icon in other cases', () => {
      component.displayedColumns = ['name'];
      fixture.detectChanges();
      const settingsIcon = fixture.debugElement.query(
        By.css('.cell-header__container .icon')
      ).nativeElement;
      expect(settingsIcon.getAttribute('ng-reflect-inline-s-v-g')).toContain(
        'activ'
      );
    });

    it('should display pagination if it is not undefined', () => {
      component.pagination = {
        currentPage: 1,
        totalPagesCount: 12,
        totalItemsCount: 119,
        perPage: 10,
      };
      fixture.detectChanges();
      const paginator = fixture.debugElement.query(By.css('.mat-paginator'))
        .nativeElement;
      expect(paginator).toBeTruthy();
    });

    it('should not display pagination if it is undefined', () => {
      const paginator = fixture.debugElement.query(By.css('.mat-paginator'));
      expect(paginator).toBeFalsy();
    });

    it('should display loading if it is not undefined and not false', () => {
      component.isLoading = true;
      fixture.detectChanges();
      const paginator = fixture.debugElement.query(By.css('.table-loader'))
        .nativeElement;
      expect(paginator).toBeTruthy();
    });

    it('should not display loading if it is undefined', () => {
      fixture.detectChanges();
      const paginator = fixture.debugElement.query(By.css('.table-loader'));
      expect(paginator).toBeFalsy();
    });

    it('should not display loading if it is false', () => {
      component.isLoading = false;
      fixture.detectChanges();
      const paginator = fixture.debugElement.query(By.css('.table-loader'));
      expect(paginator).toBeFalsy();
    });
  });
});
