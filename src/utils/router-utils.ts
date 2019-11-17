/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
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