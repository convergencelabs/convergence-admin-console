import {ModelPath} from "../model/ModelPath";

export class PathUtils {
  public static comparePaths(p1: ModelPath, p2: ModelPath): number {
    const minLen = Math.min(p1.length, p2.length);
    let result = 0;
    for(let i = 0; i < minLen; i++) {
      const e1 = p1[i];
      const e2 = p2[i];

      let cmp: number = 0;
      if (typeof e1 === "string") {
        cmp = e1.localeCompare(e2 as string);
      } else {
        cmp = (e1 as number) - (e2 as number);
      }

      if (cmp !== 0) {
        result = cmp;
        break;
      }
    }

    if (result === 0) {
      if (p1.length === p2.length) {
        return 0;
      }

      if (p1.length < p2.length) {
        return -1
      }

      return 1;
    }

    return result;
  }
}
