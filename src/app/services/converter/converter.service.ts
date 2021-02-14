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

  public getNumberFromString(value: string): number | undefined {
    const newNumber = Number(value);

    if (!isNaN(newNumber)) {
      return newNumber;
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

  public convertArrayOfAnyToString(array: any[]): string[] {
    return array.map((el) => el + '');
  }

  public convertArrayOfStringsToNullOrString(array: any[]): (string | null)[] {
    return array.map((el) => (el === '' ? null : el + ''));
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

  public getArrayOfEnumValues(enumObject): any[] {
    const allValues = Object.values(enumObject);
    const half = Math.ceil(allValues.length / 2);

    return allValues.splice(0, half);
  }

  public getArrayOfEnumKeys(enumObject): any[] {
    const allValues = Object.values(enumObject);
    const half = Math.ceil(allValues.length / 2);

    return allValues.splice(-half);
  }

  public getArrayOfStringedEnumKeys(enumObject): string[] {
    const values = this.getArrayOfEnumKeys(enumObject);
    return values.map((value) => String(value));
  }

  public clearServerRequestString(value: string): string {
    return value.replace(/[`~!@#$%^&*_|+\-=?;:<>\{\}\[\]\\\/]/gi, '');
  }

  public getUserInitials(
    name: string,
    surname: string,
    patronymic?: string
  ): string {
    const shortName = name.length > 1 ? name.substr(0, 1) : name;
    const shortNameCapitalized =
      shortName.charAt(0).toUpperCase() + shortName.slice(1);
    const surnameCapitalized =
      surname.charAt(0).toUpperCase() + surname.slice(1);
    const shortPatronymic =
      patronymic?.length > 1 ? patronymic.substr(0, 1) : patronymic;
    const shortPatronymicCapitalized = patronymic
      ? shortPatronymic.charAt(0).toUpperCase() + shortPatronymic.slice(1)
      : undefined;

    if (patronymic) {
      return (
        surnameCapitalized +
        ' ' +
        shortNameCapitalized +
        '. ' +
        shortPatronymicCapitalized +
        '.'
      );
    } else {
      return surnameCapitalized + ' ' + shortNameCapitalized + '.';
    }
  }
}
