export const today = new Date();

const tomorrowPrivate = new Date();
tomorrowPrivate.setDate(today.getDate() + 1);
export const tomorrow = tomorrowPrivate;
