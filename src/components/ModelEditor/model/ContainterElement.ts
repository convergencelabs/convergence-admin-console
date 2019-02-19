import {ModelElement, ModelElementMutationEvent} from "./ModelElement";

export abstract class ContainerElement<T> extends ModelElement<T> {

  protected constructor(id: string, parent: ContainerElement<any> | null) {
    super(id, parent);
  }

  public _bubbleChange(remote: boolean = true): void {
    this._emit(new ModelSubtreeChangedEvent(this, remote));
    const parent = this.parent();
    if (parent !== null) {
      parent._bubbleChange();
    }
  }
}

export class ModelSubtreeChangedEvent implements ModelElementMutationEvent {
  public static NAME: string = "subtree_changed";
  public name: string = ModelSubtreeChangedEvent.NAME;

  constructor(public readonly element: ModelElement<any>,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}
