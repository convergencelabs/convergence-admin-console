import {ConvergenceUser} from "./ConvergenceUser";

export class ConvergenceUserInfo {
  constructor(public user: ConvergenceUser,
              public lastLogin: Date | null,
              public globalRole: String) {
    // no-op
  }
}