import {ModelPermissions} from "./ModelPermissions";

export class ModelUserPermissions {
  constructor(
    public readonly username: string,
    public readonly permissions: ModelPermissions) {
    Object.freeze(this);
  }
}