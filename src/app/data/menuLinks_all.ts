import { MenuLink } from '../models/types/MenuLink';
import { menuLinksMain } from './menuLinks_main';
import { menuLinksSecondary } from './menuLinks_secondary';

export const menuLinksAll: MenuLink[] = [
  ...menuLinksMain,
  ...menuLinksSecondary,
];
