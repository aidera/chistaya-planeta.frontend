import { MatPaginatorIntl } from '@angular/material/paginator';

const label = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) {
    return `0 из ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} из ${length}`;
};

export const getPaginatorIntl = () => {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'На странице:';
  paginatorIntl.nextPageLabel = 'Следующая страница';
  paginatorIntl.previousPageLabel = 'Предыдущая страница';
  paginatorIntl.firstPageLabel = 'Первая страница';
  paginatorIntl.lastPageLabel = 'Последняя страница';
  paginatorIntl.getRangeLabel = label;

  return paginatorIntl;
};
