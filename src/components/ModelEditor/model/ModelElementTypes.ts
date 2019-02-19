export interface ModelElementType {
  OBJECT: string;
  ARRAY: string;
  STRING: string;
  NUMBER: string;
  BOOLEAN: string;
  DATE: string;
  NULL: string;
}

const types: ModelElementType = {
  OBJECT: "object",
  ARRAY: "array",
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  DATE: "date",
  NULL: "null"
};
Object.freeze(types);

export const ModelElementTypes = types;
