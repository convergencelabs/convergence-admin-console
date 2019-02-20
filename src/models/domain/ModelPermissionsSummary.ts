import {ModelPermissions} from "./ModelPermissions";
import {ModelUserPermissions} from "./ModelUserPermissions";
import {getOrDefault} from "../../utils/copy-utils";

export class ModelPermissionSummary {
  constructor(
    public readonly overrideWorld: boolean,
    public readonly worldPermissions: ModelPermissions,
    public readonly userPermissions: ModelUserPermissions[]) {
    Object.freeze(this);
  }

  public copy(modifications: {
    overrideWorld?: boolean,
    worldPermissions?: ModelPermissions,
    userPermissions?: ModelUserPermissions[]
  } = {}) {
    return new ModelPermissionSummary(
      getOrDefault(modifications.overrideWorld, this.overrideWorld),
      getOrDefault(modifications.worldPermissions, this.worldPermissions),
      getOrDefault(modifications.userPermissions, this.userPermissions)
    );
  }
}