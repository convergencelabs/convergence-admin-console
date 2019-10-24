export class UserApiKey {
  constructor(public key: string,
              public name: string,
              public enabled: boolean,
              public lastUsed?: Date
  ) {
    Object.freeze(this);
  }
}