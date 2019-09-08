export class PasswordConfig {
  public static PERMISSIVE = new PasswordConfig(
    0, false, false, false, false) ;

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