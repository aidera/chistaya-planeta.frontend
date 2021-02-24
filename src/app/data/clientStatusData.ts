import { OptionType } from '../models/types/OptionType';
import { TextColor } from '../models/types/TextColor';
import ClientStatus from '../models/enums/ClientStatus';

export const clientStatusStrings: string[] = [];
clientStatusStrings[ClientStatus.active] = 'Активно';
clientStatusStrings[ClientStatus.blocked] = 'Заблокировано';

export const clientStatusColors: TextColor[] = [];
clientStatusColors[ClientStatus.active] = 'green';
clientStatusColors[ClientStatus.blocked] = 'red';

export const clientStatusOptions: OptionType[] = [
  {
    text: clientStatusStrings[ClientStatus.active],
    value: ClientStatus.active + '',
  },
  {
    text: clientStatusStrings[ClientStatus.blocked],
    value: ClientStatus.blocked + '',
  },
];
