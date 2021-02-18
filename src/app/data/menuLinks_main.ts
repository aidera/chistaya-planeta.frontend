import { MenuLink } from '../models/types/MenuLink';

export const menuLinksMain: MenuLink[] = [
  {
    title: 'Заявки',
    iconPath: 'assets/icons/order.svg',
    link: 'orders',
  },
  {
    title: 'Периодические заявки',
    iconPath: 'assets/icons/scheduled-order.svg',
    link: 'scheduled-orders',
  },
  {
    title: 'Клиенты',
    iconPath: 'assets/icons/customer.svg',
    link: 'clients',
  },
  {
    title: 'Сотрудники',
    iconPath: 'assets/icons/tie.svg',
    link: 'employees',
  },
  {
    title: 'Автомобили',
    iconPath: 'assets/icons/truck.svg',
    link: 'cars',
  },
  {
    title: 'Подразделения',
    iconPath: 'assets/icons/offices.svg',
    link: 'divisions',
  },
  {
    title: 'Населённые пункты',
    iconPath: 'assets/icons/world.svg',
    link: 'localities',
  },
  {
    title: 'Расценки',
    iconPath: 'assets/icons/price-tag.svg',
    link: 'prices',
  },
];
