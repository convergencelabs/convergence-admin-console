/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

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