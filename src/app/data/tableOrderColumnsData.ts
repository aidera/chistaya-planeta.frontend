import { TableColumnData } from '../models/types/TableColumnData';
import OrderStatus, {
  orderStatusColors,
  orderStatusStrings,
} from '../models/enums/OrderStatus';
import OrderType, { orderTypeStrings } from '../models/enums/OrderType';
import RawType, { rawTypeStrings } from '../models/enums/RawType';
import RawUnit, { rawUnitStrings } from '../models/enums/RawUnit';
import DeliveryType, {
  deliveryTypeStrings,
} from '../models/enums/DeliveryType';
import PaymentMethod, {
  paymentMethodStrings,
} from '../models/enums/PaymentMethod';

export const tableOrderColumnsData: { [key: string]: TableColumnData } = {
  status: {
    title: 'Статус',
    modificator: (value: OrderStatus) => {
      let modifiedValue = orderStatusStrings[value];
      modifiedValue =
        modifiedValue.charAt(0).toUpperCase() + modifiedValue.slice(1);
      modifiedValue = `<p class="${orderStatusColors[value]}-text">${modifiedValue}</p>`;
      return modifiedValue;
    },
  },
  type: {
    title: 'Тип заявки',
    modificator: (value: OrderType) => {
      let modifiedValue = orderTypeStrings[value];
      modifiedValue =
        modifiedValue.charAt(0).toUpperCase() + modifiedValue.slice(1);
      return modifiedValue;
    },
  },
  rawType: {
    title: 'Тип сырья',
    modificator: (value: RawType[]) => {
      let modifiedValue = '';
      value.forEach((item) => {
        modifiedValue =
          modifiedValue === ''
            ? rawTypeStrings[item]
            : modifiedValue + ', ' + rawTypeStrings[item];
      });
      modifiedValue =
        modifiedValue.charAt(0).toUpperCase() + modifiedValue.slice(1);
      return modifiedValue;
    },
  },
  rawAmount: {
    title: 'Прибл. кол-во сырья',
    modificator: (value: { value: number; unit: RawUnit }) => {
      return value.value + ' ' + rawUnitStrings[value.unit];
    },
  },
  locality: {
    title: 'Населённый пункт',
  },
  division: {
    title: 'Подразделение',
  },
  deliveryType: {
    title: 'Тип доставки',
    modificator: (value: DeliveryType) => {
      let modifiedValue = deliveryTypeStrings[value];
      modifiedValue =
        modifiedValue.charAt(0).toUpperCase() + modifiedValue.slice(1);
      return modifiedValue;
    },
  },
  deliveryAddress: {
    title: 'Адрес доставки',
  },
  hasAssistant: {
    title: 'Помощник',
    modificator: (value: boolean) => {
      return value === true ? 'есть' : value === false ? 'нет' : '-';
    },
  },
  customerCarNumber: {
    title: 'Номер авто клиента',
  },
  customerOrganizationLegalName: {
    title: 'Юр. наиманование организации',
  },
  customerOrganizationActualName: {
    title: 'Факт. наиманование организации',
  },
  contactName: {
    title: 'Контактное имя',
  },
  contactPhone: {
    title: 'Контактный телефон',
    modificator: (value: string) => {
      return (
        value[0] +
        value[1] +
        ' (' +
        value[2] +
        value[3] +
        value[4] +
        ') ' +
        value[5] +
        value[6] +
        value[7] +
        '-' +
        value[8] +
        value[9] +
        '-' +
        value[10] +
        value[11]
      );
    },
  },
  paymentMethod: {
    title: 'Способ оплаты',
    modificator: (value: PaymentMethod) => {
      let modifiedValue = paymentMethodStrings[value];
      modifiedValue =
        modifiedValue.charAt(0).toUpperCase() + modifiedValue.slice(1);
      return modifiedValue;
    },
  },
  paymentMethodData: {
    title: 'Информация об оплате',
  },
  manager: {
    title: 'Менеджер',
  },
  driver: {
    title: 'Водитель',
  },
  weigher: {
    title: 'Весовщик',
  },
  desiredPickupDate: {
    title: 'Желаемая дата',
    modificator: (value: string) => {
      const modifiedValue = new Date(value);

      const day = modifiedValue.getDate();
      const month = modifiedValue.getMonth() + 1;
      const year = modifiedValue.getFullYear();
      const hours = modifiedValue.getHours();
      const minutes = modifiedValue.getMinutes();

      return (
        (day < 10 ? '0' + day : day) +
        '.' +
        (month < 10 ? '0' + month : month) +
        '.' +
        year +
        ' - ' +
        (hours < 10 ? '0' + hours : hours) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes)
      );
    },
  },
  createdAt: {
    title: 'Дата создания заявки',
    modificator: (value: string) => {
      const modifiedValue = new Date(value);

      const day = modifiedValue.getDate();
      const month = modifiedValue.getMonth() + 1;
      const year = modifiedValue.getFullYear();
      const hours = modifiedValue.getHours();
      const minutes = modifiedValue.getMinutes();

      return (
        (day < 10 ? '0' + day : day) +
        '.' +
        (month < 10 ? '0' + month : month) +
        '.' +
        year +
        ' - ' +
        (hours < 10 ? '0' + hours : hours) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes)
      );
    },
  },
  weighedRaw: {
    title: 'Взвешенное сырье',
    modificator: (value: RawType[]) => {
      let modifiedValue = '';
      value.forEach((item) => {
        modifiedValue =
          modifiedValue === ''
            ? rawTypeStrings[item]
            : modifiedValue + ', ' + rawTypeStrings[item];
      });
      modifiedValue =
        modifiedValue.charAt(0).toUpperCase() + modifiedValue.slice(1);
      return modifiedValue;
    },
  },
  weighedRawAMount: {
    title: 'Кол-во взвешенного сырья',
  },
  customerComment: {
    title: 'Комментарий заказчика',
  },
  employeeComment: {
    title: 'Комментарий сотрудника',
  },
};
