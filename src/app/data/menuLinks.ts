import { MenuLink } from '../models/types/MenuLink';
import EmployeeRole from '../models/enums/EmployeeRole';

export const menuLinksMain: MenuLink[] = [
  {
    title: 'Задачи',
    iconPath: 'assets/icons/to-do.svg',
    link: 'tasks',
    employeesCanSee: [
      EmployeeRole.head,
      EmployeeRole.admin,
      EmployeeRole.clientManager,
      EmployeeRole.driver,
      EmployeeRole.receivingManager,
    ],
    clientCanSee: false,
  },
  {
    title: 'Заявки',
    iconPath: 'assets/icons/order.svg',
    link: 'orders',
    employeesCanSee: [
      EmployeeRole.head,
      EmployeeRole.admin,
      EmployeeRole.clientManager,
      EmployeeRole.driver,
      EmployeeRole.receivingManager,
    ],
    clientCanSee: true,
  },
  // {
  //   title: 'Периодические заявки',
  //   iconPath: 'assets/icons/scheduled-order.svg',
  //   link: 'scheduled-orders',
  // },
  // {
  //   title: 'Клиенты',
  //   iconPath: 'assets/icons/customer.svg',
  //   link: 'clients',
  // },
  {
    title: 'Сотрудники',
    iconPath: 'assets/icons/tie.svg',
    link: 'employees',
    employeesCanSee: [
      EmployeeRole.head,
      EmployeeRole.admin,
      EmployeeRole.clientManager,
    ],
    clientCanSee: false,
  },
  {
    title: 'Автомобили',
    iconPath: 'assets/icons/truck.svg',
    link: 'cars',
    employeesCanSee: [
      EmployeeRole.head,
      EmployeeRole.admin,
      EmployeeRole.clientManager,
    ],
    clientCanSee: false,
  },
  {
    title: 'Подразделения',
    iconPath: 'assets/icons/offices.svg',
    link: 'divisions',
    employeesCanSee: [EmployeeRole.head, EmployeeRole.admin],
    clientCanSee: false,
  },
  {
    title: 'Населённые пункты',
    iconPath: 'assets/icons/world.svg',
    link: 'localities',
    employeesCanSee: [EmployeeRole.head, EmployeeRole.admin],
    clientCanSee: false,
  },
  {
    title: 'Расценки',
    iconPath: 'assets/icons/price-tag.svg',
    link: 'prices',
    employeesCanSee: [
      EmployeeRole.head,
      EmployeeRole.admin,
      EmployeeRole.clientManager,
      EmployeeRole.receivingManager,
    ],
    clientCanSee: true,
  },
];

export const menuLinksSecondary: MenuLink[] = [
  {
    title: 'Профиль',
    iconPath: 'assets/icons/settings.svg',
    link: 'profile',
    employeesCanSee: [
      EmployeeRole.head,
      EmployeeRole.admin,
      EmployeeRole.clientManager,
      EmployeeRole.driver,
      EmployeeRole.receivingManager,
    ],
    clientCanSee: true,
  },
];

export const menuLinksAll: MenuLink[] = [
  ...menuLinksMain,
  ...menuLinksSecondary,
];
