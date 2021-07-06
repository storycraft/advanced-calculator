/*
 * Created on Tue Jun 22 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { Expression } from "./expression.ts";
import { FunctionDecl } from "./function.ts";
import { VariableDecl } from "./variable.ts";

export * from './number.ts';
export * from './function.ts';
export * from './value.ts';
export * from './ident.ts';
export * from './expression.ts';
export * from './variable.ts';
export * from './equation.ts';
export * from './condition.ts';

export type Variant<T, V> = {

    type: T;
    value: V;

};

export type Return = {

    expression: Expression;

};

export type Statement = Variant<'FUNCTION_DECL', FunctionDecl> | Variant<'VARIABLE_DECL', VariableDecl> | Variant<'EXPRESSION', Expression> | Variant<'RETURN', Return>;

export type ProgramBody = {

    sentences: Statement[];

};

export type Program = ProgramBody;
