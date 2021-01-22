import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  constructor() {}

  public getRealBooleanFromStringedBoolean(value: any): boolean | undefined {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return undefined;
  }

  public getArrayOrUndefined<T>(
    value: any,
    arrayLength?: number,
    elementTransformer?: (e: any) => any
  ): T[] | undefined {
    if (!value) {
      return undefined;
    }
    if (Array.isArray(value)) {
      if (arrayLength !== undefined) {
        if (value.length === arrayLength) {
          return elementTransformer ? elementTransformer(value) : value;
        } else {
          return undefined;
        }
      }
      return elementTransformer ? elementTransformer(value) : value;
    }
    return undefined;
  }

  public convertArrayOfStringedBooleanToRealBoolean(
    array: string[]
  ): boolean[] {
    return array.map((el) => el === 'true');
  }

  public convertArrayOfNumberBooleanToRealBoolean(array: number[]): boolean[] {
    return array.map((el) => el > 0);
  }

  public getServerFromToDateInISOStringArray(
    dateFrom?: Date,
    dateTo?: Date
  ): string[] | undefined {
    let valueToReturn = [];
    if (dateFrom) {
      valueToReturn[0] = new Date(dateFrom).toISOString();
    } else {
      valueToReturn[0] = null;
    }
    if (dateTo) {
      valueToReturn[1] = new Date(dateTo).toISOString();
    } else {
      valueToReturn[1] = null;
    }
    if (
      (valueToReturn[0] === null && valueToReturn[1] === null) ||
      valueToReturn.length <= 0
    ) {
      valueToReturn = undefined;
    }
    return valueToReturn;
  }

  public clearServerRequestString(value: string): string {
    return value.replace(/[`~!@#$%^&*_|+\-=?;:<>\{\}\[\]\\\/]/gi, '');
  }
}
