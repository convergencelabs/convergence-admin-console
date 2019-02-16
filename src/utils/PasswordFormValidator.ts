import {
  DigitRequiredViolation,
  LowerCaseRequiredViolation,
  MinLengthPasswordViolation,
  PasswordPolicyChecker,
  SpecialRequiredViolation,
  UpperCaseRequiredViolation
} from "./PasswordPolicyChecker";
import {PasswordConfig} from "../models/PasswordConfig";

export class PasswordFormValidator {
  private _passwordChecker: PasswordPolicyChecker = new PasswordPolicyChecker();

  public validatePassword(config: PasswordConfig, value: string, callback: (error?: string) => void): boolean {
    value = value || "";
    const violations = this._passwordChecker.check(value, config);

    if (violations.length > 0) {
      const violation = violations[0];
      if (violation instanceof MinLengthPasswordViolation) {
        callback(`The password must be at least ${violation.minLength} characters long.`);
        return false;
      } else if (violation instanceof UpperCaseRequiredViolation) {
        callback(`The password must contain an upper case character.`);
        return false;
      } else if (violation instanceof LowerCaseRequiredViolation) {
        callback(`The password must contain a lower case character.`);
        return false;
      } else if (violation instanceof DigitRequiredViolation) {
        callback(`The password must contain a digit.`);
        return false;
      } else if (violation instanceof SpecialRequiredViolation) {
        callback(`The password must contain a special character.`);

      }
      return false;
    }

    return true;
  }
}
