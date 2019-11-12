/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

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
