import {ModelElement} from "./ModelElement";
import {ModelElementTypes} from "./ModelElementTypes";
import {ContainerElement} from "./ContainterElement";

export abstract class NullElement extends ModelElement<null> {
  protected constructor(id: string, parent: ContainerElement<any>) {
    super(id, parent);
  }

  public type(): string {
    return ModelElementTypes.NULL;
  }

  protected _emitValue(remote: boolean = false): void {
    throw new Error("Null values can not change their value.");
  }
}
