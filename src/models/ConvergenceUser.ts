export class ConvergenceUser {
  constructor(public username: string,
              public displayName: string,
              public firstName: string,
              public lastName: string,
              public email: string,
              public lastLogin: Date | null,
              public serverRole: string) {
    // no-op
  }
}
