import {DomainUserId} from "./DomainUserId";

export class DomainSession {
  constructor(
    public readonly id: string,
    public readonly userId: DomainUserId,
    public readonly connected: Date,
    public readonly disconnected: Date | null,
    public readonly authMethod: string,
    public readonly client: string,
    public readonly clientVersion: string,
    public readonly clientMetaData: string,
    public readonly remoteHost: string
  ) {
    Object.freeze(this);
  }
}