import { createAction, props } from '@ngrx/store';

export const SET_IS_FULLSCREEN_MENU_OPEN = '[app] Set Is Fullscreen Menu Open';

export const setIsFullscreenMenuOpen = createAction(
  SET_IS_FULLSCREEN_MENU_OPEN,
  props<{ isOpen: boolean }>()
);
