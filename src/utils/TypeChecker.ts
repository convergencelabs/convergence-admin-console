/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class TypeChecker {
  public static isArray(value: any): value is any[] {
    return Array.isArray(value);
  }

  public static isBoolean(value: any): value is boolean {
    return typeof value === "boolean";
  }

  public static isDate(value: any): value is Date {
    return value instanceof Date;
  }

  public static isError(value: any): value is Error {
    return value instanceof Error && typeof value.message !== "undefined";
  }

  public static isFunction(value: any): value is (...args: any[]) => any {
    return typeof value === "function";
  }

  public static isNull(value: any): value is null {
    return value === null;
  }

  public static isNumber(value: any): value is number {
    return typeof value === "number" && isFinite(value);
  }

  public static isObject(value: any): value is any {
    return value && typeof value === "object" && value.constructor === Object;
  }

  public static isString(value: any): value is string {
    return typeof value === "string" || value instanceof String;
  }

  public static isSymbol(value: any): value is any {
    return typeof value === "symbol";
  }

  public static isRegExp(value: any): value is RegExp {
    return value && typeof value === "object" && value.constructor === RegExp;
  }

  public static isUndefined(value: any): value is undefined {
    return typeof value === "undefined";
  }

  public static switch<T>(value: any, matcher: ITypeMatch<T>): T {
    if (TypeChecker.isUndefined(matcher) || TypeChecker.isNull(matcher)) {
      throw new Error("matcher must be defined.");
    }

    const customRule = TypeChecker._findCustomRule(value, matcher);

    if (!TypeChecker.isUndefined(customRule)) {
      return customRule.callback(value);
    } else if (TypeChecker.isArray(value) && !TypeChecker.isUndefined(matcher.array)) {
      return matcher.array(value);
    } else if (TypeChecker.isBoolean(value) && !TypeChecker.isUndefined(matcher.boolean)) {
      return matcher.boolean(value);
    } else if (TypeChecker.isError(value) && !TypeChecker.isUndefined(matcher.error)) {
      return matcher.error(value);
    } else if (TypeChecker.isDate(value) && !TypeChecker.isUndefined(matcher.date)) {
      return matcher.date(value);
    } else if (TypeChecker.isFunction(value) && !TypeChecker.isUndefined(matcher.function)) {
      return matcher.function(value);
    } else if (TypeChecker.isNull(value) && !TypeChecker.isUndefined(matcher.null)) {
      return matcher.null();
    } else if (TypeChecker.isNumber(value) && !TypeChecker.isUndefined(matcher.number)) {
      return matcher.number(value);
    } else if (TypeChecker.isObject(value) && !TypeChecker.isUndefined(matcher.object)) {
      return matcher.object(value);
    } else if (TypeChecker.isRegExp(value) && !TypeChecker.isUndefined(matcher.regexp)) {
      return matcher.regexp(value);
    } else if (TypeChecker.isString(value) && !TypeChecker.isUndefined(matcher.string)) {
      return matcher.string(value);
    } else if (TypeChecker.isSymbol(value) && !TypeChecker.isUndefined(matcher.symbol)) {
      return matcher.symbol(value);
    } else if (TypeChecker.isUndefined(value) && !TypeChecker.isUndefined(matcher.undefined)) {
      return matcher.undefined();
    } else if (!TypeChecker.isUndefined(matcher.default)) {
      return matcher.default(value);
    } else {
      throw new Error("Value was not handled: " + value);
    }
  }

  private static _findCustomRule<T>(value: any, matcher: ITypeMatch<T>): ICustomTypeMatchRule<T> | undefined {
    const customRule: ICustomTypeMatchRule<any> | undefined =
      TypeChecker.isArray(matcher.custom) ?
        matcher.custom.find(rule => {
          return TypeChecker.isFunction(rule.test) &&
            TypeChecker.isFunction(rule.callback) &&
            rule.test(value);
        }) :
        undefined;
    return customRule;
  }
}

export interface ITypeMatch<T> {
  array?: (value: any[]) => T;
  boolean?: (value: boolean) => T;
  error?: (value: Error) => T;
  date?: (value: Date) => T;
  function?: (value: (...args: any[]) => any) => T;
  null?: () => T;
  number?: (value: number) => T;
  object?: (value: any) => T;
  regexp?: (value: RegExp) => T;
  string?: (value: string) => T;
  symbol?: (value: any) => T;
  undefined?: () => T;
  default?: (value: any) => T;
  custom?: Array<ICustomTypeMatchRule<T>>;
}

export interface ICustomTypeMatchRule<T> {
  test(value: any): boolean;

  callback(value: any): T;
}
