import {getOrDefault} from "../../utils/copy-utils";

export class ModelPermissions {
  constructor(
    public readonly read: boolean,
    public readonly write: boolean,
    public readonly remove: boolean,
    public readonly manage: boolean) {
    Object.freeze(this);
  }

  public copy(modifications: {
    read?: boolean,
    write?: boolean,
    remove?: boolean,
    manage?: boolean} = {}): ModelPermissions {

    return new ModelPermissions(
      getOrDefault(modifications.read, this.read),
      getOrDefault(modifications.write, this.write),
      getOrDefault(modifications.remove, this.remove),
      getOrDefault(modifications.manage, this.manage)
    )
  }
}

