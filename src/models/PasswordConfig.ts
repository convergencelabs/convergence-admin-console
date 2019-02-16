export class PasswordConfig {
  constructor(
    public readonly minLength: number,
    public readonly requireUpper: boolean,
    public readonly requireLower: boolean,
    public readonly requireDigit: boolean,
    public readonly requireSpecial: boolean
  ) {
    Object.freeze(this);
  }
}