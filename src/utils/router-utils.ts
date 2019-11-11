import queryString from 'query-string';

type QueryParamObj = {[key: string]: string | number | undefined};

export function createQueryParamString(obj: QueryParamObj): string {
  return `?${queryString.stringify(obj)}`;
}

export function appendToQueryParamString(obj: {[key: string]: string | number | undefined}): string {
  let parsed = queryString.parse(window.location.search, {parseNumbers: true}) as QueryParamObj;
  Object.assign(parsed, obj);
  return createQueryParamString(parsed);
}