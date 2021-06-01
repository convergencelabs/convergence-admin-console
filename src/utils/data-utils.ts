export function getOrElse<T>(value: T, defaultValue: T): T {
  return value === undefined ? defaultValue : value;
}