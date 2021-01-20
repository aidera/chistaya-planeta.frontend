import { clearSearchRequestRegex } from './regexes';

export const highlightSearchedValue = (objectValue, searchValue) => {
  if (searchValue) {
    const clearQuickSearchValue = searchValue
      .replace(clearSearchRequestRegex, '')
      .toLowerCase();
    const clearObjectValue = objectValue.toLowerCase();
    const indexFrom = clearObjectValue.indexOf(clearQuickSearchValue);
    if (indexFrom >= 0) {
      const split = clearObjectValue.split(clearQuickSearchValue);
      const objectValuePart = objectValue.substr(
        indexFrom,
        clearQuickSearchValue.length
      );
      return split[0] + '<strong>' + objectValuePart + '</strong>' + split[1];
    }
  }
  return objectValue;
};
