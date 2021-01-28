export const removeURLParameter = (url: string, parameter: string) => {
  const urlParts = url.split('?');
  if (urlParts.length >= 2) {
    const prefix = encodeURIComponent(parameter) + '=';
    const pars = urlParts[1].split(/[&]/g);

    for (let i = pars.length; i-- > 0; ) {
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }

    return urlParts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
  }
  return url;
};
