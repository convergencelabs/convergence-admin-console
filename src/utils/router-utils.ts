import queryString from 'query-string';

type QueryParamObj = {[key: string]: string | number | undefined};

export function createQueryParamString(obj: QueryParamObj): string {
  return `?${queryString.stringify(obj)}`;
}

export function appendtoQueryParamString(obj: {[key: string]: string | number | undefined}): string {
  let parsed = queryString.parse(location.search, {parseNumbers: true}) as QueryParamObj;
  Object.assign(parsed, obj);
  return createQueryParamString(parsed);
}