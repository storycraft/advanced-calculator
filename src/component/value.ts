/*
 * Created on Thu Jun 24 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { Expression, Variant, FunctionCall, Ident, Numberic } from "./mod.ts";

export type DynamicValue = Variant<'VARIABLE', Ident> | Variant<'FNCALL', FunctionCall>;

export type Factor = Variant<'STATIC', Numberic> | Variant<'DYNAMIC', DynamicValue> | Variant<'EXPRESSION', Expression>;
