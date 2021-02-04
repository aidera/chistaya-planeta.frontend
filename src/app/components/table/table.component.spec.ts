import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';

import { TableColumnType, TableComponent } from './table.component';
import { TextInputComponent } from '../form-controls/text-input/text-input.component';
import { CheckboxComponent } from '../form-controls/checkbox/checkbox.component';
import { DateInputComponent } from '../form-controls/date-input/date-input.component';
import { MaterialModule } from '../../modules/material/material.module';

const mockColumnsData: TableColumnType[] = [
  {
    key: 'name',
    title: 'Имя',
  },
  {
    key: 'surname',
    title: 'Фамилия',
  },
  {
    key: 'age',
    title: 'Возраст',
  },
  {
    key: 'hobbies',
    title: 'Увлечения',
  },
  {
    key: 'birth',
    title: 'День рождения',
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
        ReactiveFormsModule,
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
    component.displayForm = new FormGroup({
      name: new FormControl(true),
      surname: new FormControl(true),
      age: new FormControl(true),
      hobbies: new FormControl(true),
      birth: new FormControl(true),
    });
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

      component.displayAll();

      expect(component.display.emit).toHaveBeenCalledTimes(1);
      expect(component.display.emit).toHaveBeenCalledWith(
        component.columnsCanBeDisplayed
      );
    });

    it('should return display settings without name option', () => {
      spyOn(component.display, 'emit');

      component.displayForm.get('name').setValue(false);
      fixture.detectChanges();

      expect(component.display.emit).toHaveBeenCalledTimes(1);
      expect(component.display.emit).toHaveBeenCalledWith(
        component.columnsCanBeDisplayed.filter((column) => column !== 'name')
      );
    });

    it('should return display settings without name and surname options', () => {
      spyOn(component.display, 'emit');

      component.displayForm.get('name').setValue(false);
      component.displayForm.get('surname').setValue(false);
      fixture.detectChanges();

      expect(component.display.emit).toHaveBeenCalledTimes(2);
      expect(component.display.emit).toHaveBeenCalledWith(
        component.columnsCanBeDisplayed.filter(
          (column) => column !== 'name' && column !== 'surname'
        )
      );
    });

    it('should emit only birth parameter', () => {
      spyOn(component.display, 'emit');

      component.displayForm.get('name').setValue(false);
      component.displayForm.get('surname').setValue(false);
      component.displayForm.get('age').setValue(false);
      component.displayForm.get('hobbies').setValue(false);
      fixture.detectChanges();

      expect(component.display.emit).toHaveBeenCalledTimes(4);
      expect(component.display.emit).toHaveBeenCalledWith(['birth']);
    });

    it('should not be disabled if there is no selected params', () => {
      component.displayForm.get('name').setValue(false);
      component.displayForm.get('surname').setValue(false);
      component.displayForm.get('age').setValue(false);
      component.displayForm.get('hobbies').setValue(false);
      component.displayForm.get('birth').setValue(false);
      fixture.detectChanges();

      expect(component.displayForm.get('name').disabled).toBe(false);
      expect(component.displayForm.get('surname').disabled).toBe(false);
      expect(component.displayForm.get('age').disabled).toBe(false);
      expect(component.displayForm.get('hobbies').disabled).toBe(false);
      expect(component.displayForm.get('birth').disabled).toBe(false);
    });

    it('should be disabled true parameter if only one parameter is true', () => {
      component.displayForm.get('name').setValue(false);
      component.displayForm.get('surname').setValue(false);
      component.displayForm.get('age').setValue(false);
      component.displayForm.get('hobbies').setValue(false);
      fixture.detectChanges();

      expect(component.displayForm.get('name').disabled).toBe(false);
      expect(component.displayForm.get('surname').disabled).toBe(false);
      expect(component.displayForm.get('age').disabled).toBe(false);
      expect(component.displayForm.get('hobbies').disabled).toBe(false);
      expect(component.displayForm.get('birth').disabled).toBe(true);
    });

    it('should not be disabled if more then one parameter is true', () => {
      component.displayForm.get('name').setValue(false);
      component.displayForm.get('surname').setValue(false);
      component.displayForm.get('age').setValue(false);
      fixture.detectChanges();

      expect(component.displayForm.get('name').disabled).toBe(false);
      expect(component.displayForm.get('surname').disabled).toBe(false);
      expect(component.displayForm.get('age').disabled).toBe(false);
      expect(component.displayForm.get('hobbies').disabled).toBe(false);
      expect(component.displayForm.get('birth').disabled).toBe(false);
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
      expect(component.paginate.emit).toHaveBeenCalledWith(3);
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
        page: 1,
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
      const loader = fixture.debugElement.query(By.css('.table-loader'))
        .nativeElement;
      expect(loader).toBeTruthy();
    });

    it('should not display loading if it is undefined', () => {
      fixture.detectChanges();
      const loader = fixture.debugElement.query(By.css('.table-loader'));
      expect(loader).toBeFalsy();
    });

    it('should not display loading if it is false', () => {
      component.isLoading = false;
      fixture.detectChanges();
      const loader = fixture.debugElement.query(By.css('.table-loader'));
      expect(loader).toBeFalsy();
    });

    it('should display no data error message if data is empty array', () => {
      component.data = [];
      fixture.detectChanges();

      const tbody = fixture.debugElement.query(By.css('tbody')).nativeElement;
      const trs = tbody.querySelectorAll('tr');
      expect(trs.length).toBe(1);
      expect(trs[0].textContent).toContain(
        'К сожалению, по вашему запросу ничего не найдено'
      );
    });

    it('should not display no data error message if data is null', () => {
      component.data = null;
      fixture.detectChanges();

      const tbody = fixture.debugElement.query(By.css('tbody')).nativeElement;
      const trs = tbody.querySelectorAll('tr');
      expect(trs.length).toBe(1);
      expect(trs[0].textContent).not.toContain(
        'К сожалению, по вашему запросу ничего не найдено'
      );
    });

    it('should not display correct number of rows and columns', () => {
      const tbody = fixture.debugElement.query(By.css('tbody')).nativeElement;
      const trs = tbody.querySelectorAll('tr');
      expect(trs.length).toBe(3);

      const tdsInTr = trs[0].querySelectorAll('td');
      expect(tdsInTr.length).toBe(6);
    });

    it('should display correct data in td', () => {
      const tbody = fixture.debugElement.query(By.css('tbody')).nativeElement;
      const trs = tbody.querySelectorAll('tr');
      const tdsInTr = trs[0].querySelectorAll('td');
      expect(tdsInTr[0].textContent).toBe('1');
      expect(tdsInTr[1].textContent).toBe('Jack');
      expect(tdsInTr[2].textContent).toBe('Hopkins');
      expect(tdsInTr[3].textContent).toBe('16');
      expect(tdsInTr[4].textContent).toBe('hobby3');
    });
  });
});
