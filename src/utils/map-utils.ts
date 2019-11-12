/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export function objectToMap(obj: {[key: string]: any}): Map<string, any> {
  const map = new Map<string, any>();
  Object.keys(obj).forEach(k => {
    const v = obj[k];
    map.set(k, v);
  });

  return map;
}
