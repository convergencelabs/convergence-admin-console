export function objectToMap(obj: {[key: string]: any}): Map<string, any> {
  const map = new Map<string, any>();
  Object.keys(obj).forEach(k => {
    const v = obj[k];
    map.set(k, v);
  });

  return map;
}
