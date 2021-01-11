import { MenuLink } from '../models/types/MenuLink';

export const menuLinksMain: MenuLink[] = [
  {
    title: 'Заявки',
    iconPath: 'assets/icons/order.svg',
    link: './orders',
  },
  {
    title: 'Периодические заявки',
    iconPath: 'assets/icons/scheduled-order.svg',
    link: './scheduled-orders',
  },
  {
    title: 'Клиенты',
    iconPath: 'assets/icons/customer.svg',
    link: './clients',
  },
  {
    title: 'Сотрудники',
    iconPath: 'assets/icons/tie.svg',
    link: './employees',
  },
  {
    title: 'Подразделения',
    iconPath: 'assets/icons/offices.svg',
    link: './divisions',
  },
];
