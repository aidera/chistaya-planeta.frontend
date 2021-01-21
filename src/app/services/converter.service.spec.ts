import { TestBed } from '@angular/core/testing';

import { ConverterService } from './converter.service';

describe('ConverterService', () => {
  let service: ConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRealBooleanFromStringedBoolean', () => {
    it('should return correct true boolean', () => {
      expect(service.getRealBooleanFromStringedBoolean('true')).toBe(true);
    });
    it('should return correct false boolean', () => {
      expect(service.getRealBooleanFromStringedBoolean('false')).toBe(false);
    });
    it('should return undefined if the value is not stringed boolean', () => {
      expect(
        service.getRealBooleanFromStringedBoolean('some-other-value')
      ).toBe(undefined);
    });
  });

  describe('getArrayOrUndefined', () => {
    it('should return the same array if it was correct array', () => {
      expect(service.getArrayOrUndefined(['value1'])).toEqual(['value1']);
    });
    it('should return undefined if it was not correct array', () => {
      expect(service.getArrayOrUndefined('value1')).toEqual(undefined);
    });

    it('should return the same array if it was correct array and it equals to length parameter (check 1)', () => {
      expect(service.getArrayOrUndefined(['value1'], 1)).toEqual(['value1']);
    });
    it('should return the same array if it was correct array and it equals to length parameter (check 2)', () => {
      expect(service.getArrayOrUndefined(['value1', 'value2'], 2)).toEqual([
        'value1',
        'value2',
      ]);
    });

    it('should return undefined if it array is not equals to length parameter (check 1)', () => {
      expect(service.getArrayOrUndefined(['value1'], 2)).toEqual(undefined);
    });
    it('should return undefined if it array is not equals to length parameter (check 2)', () => {
      expect(service.getArrayOrUndefined(['value1', 'value2'], 1)).toEqual(
        undefined
      );
    });

    it('should modify each arrays element with transform function and return modified array', () => {
      const transform = (array: string[]) => {
        return array.map((el) => +el);
      };
      expect(service.getArrayOrUndefined(['1', '2'], 2, transform)).toEqual([
        1,
        2,
      ]);
    });
  });

  describe('convertArrayOfStringedBooleanToRealBoolean', () => {
    it('should return correct array with boolean', () => {
      expect(
        service.convertArrayOfStringedBooleanToRealBoolean(['true', 'false'])
      ).toEqual([true, false]);
    });
  });

  describe('convertArrayOfNumberBooleanToRealBoolean', () => {
    it('should return correct array with boolean', () => {
      expect(service.convertArrayOfNumberBooleanToRealBoolean([1, 0])).toEqual([
        true,
        false,
      ]);
    });
  });

  describe('getServerFromToDateInISOStringArray', () => {
    it('should return array with stringed date from and null date to', () => {
      const firstDate = new Date();
      expect(service.getServerFromToDateInISOStringArray(firstDate)).toEqual([
        firstDate.toISOString(),
        null,
      ]);
    });

    it('should return array with stringed date to and null date from', () => {
      const secondDate = new Date();
      expect(
        service.getServerFromToDateInISOStringArray(undefined, secondDate)
      ).toEqual([null, secondDate.toISOString()]);
    });

    it('should return array with 2 stringed dates', () => {
      const firstDate = new Date();
      const secondDate = new Date();
      expect(
        service.getServerFromToDateInISOStringArray(firstDate, secondDate)
      ).toEqual([firstDate.toISOString(), secondDate.toISOString()]);
    });
  });
});
