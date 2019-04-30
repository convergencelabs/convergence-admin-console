export class NamespaceConfig {
  constructor(
    public readonly namespacesEnabled: boolean,
    public readonly userNamespacesEnabled: boolean,
    public readonly defaultNamespace: string
  ) {
    Object.freeze(this);
  }
}