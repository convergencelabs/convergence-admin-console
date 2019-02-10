export class Namespace{
  constructor(public id: string,
              public displayName: string
  ) {
    Object.freeze(this);
  }
}
