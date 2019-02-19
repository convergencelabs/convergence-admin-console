import {ModelPermissions} from "./ModelPermissions";
import {ModelUserPermissions} from "./ModelUserPermissions";

export class ModelPermissionSummary {
  constructor(
    public readonly overrideWorld: boolean,
    public readonly worldPermissions: ModelPermissions,
    public readonly userPermissions: ModelUserPermissions[]) {
    Object.freeze(this);
  }
}