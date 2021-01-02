/*
 * Статус автомобиля:
 * -- в рабочем состоянии
 * -- временно недоступен
 * -- недоступен
 */

enum CarStatus {
  active,
  temporaryUnavailable,
  unavailable,
}

export default CarStatus;
