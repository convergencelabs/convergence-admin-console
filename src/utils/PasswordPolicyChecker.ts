import {PasswordConfig} from "../models/PasswordConfig";

export interface PasswordViolation {
  readonly type: "min-length" | "require-upper" | "require-lower" | "require-digit" | "require-special"
}

export class MinLengthPasswordViolation implements PasswordViolation {
  public readonly type = "min-length";

  constructor(public readonly minLength: number) {
  }
}

export class UpperCaseRequiredViolation implements PasswordViolation {
  public readonly type = "require-upper";
}

export class LowerCaseRequiredViolation implements PasswordViolation {
  public readonly type = "require-lower";
}

export class DigitRequiredViolation implements PasswordViolation {
  public readonly type = "require-digit";
}

export class SpecialRequiredViolation implements PasswordViolation {
  public readonly type = "require-special";
}
export class PasswordPolicyChecker {
  private static readonly UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static readonly LOWER = "abcdefghijklmnopqrstuvwxyz";
  private static readonly DIGIT = "0123456789";
  private static readonly SPECIAL = "!@#$%&*()-_+={}[]<>,./?|\\;:'\"";
  
  public check(password: string, config: PasswordConfig): PasswordViolation[] {
    const viloations: PasswordViolation[] = [];

    if (password.length < config.minLength) {
      viloations.push(new MinLengthPasswordViolation(config.minLength)) ;
    }

    if (config.requireUpper && !PasswordPolicyChecker._contains(password, PasswordPolicyChecker.UPPER)) {
      viloations.push(new UpperCaseRequiredViolation()) ;
    }

    if (config.requireLower && !PasswordPolicyChecker._contains(password, PasswordPolicyChecker.LOWER)) {
      viloations.push(new LowerCaseRequiredViolation()) ;
    }

    if (config.requireDigit && !PasswordPolicyChecker._contains(password, PasswordPolicyChecker.DIGIT)) {
      viloations.push(new DigitRequiredViolation()) ;
    }

    if (config.requireSpecial && !PasswordPolicyChecker._contains(password, PasswordPolicyChecker.SPECIAL)) {
      viloations.push(new SpecialRequiredViolation()) ;
    }

   return viloations;
  }

  private static _contains(password: string, requiredChars: string) {
    for (let i = 0; i < password.length; i++) {
      const char = password.charAt(i);
      if (requiredChars.indexOf(char) >= 0) {
        return true;
      }
    }
    return false;
  }
}
