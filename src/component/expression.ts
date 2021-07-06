/*
 * Created on Tue Jun 22 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { Factor, Variant } from "./mod.ts";

export type Expr<T> = {

    operator: string;
    values: [T, T];

};

export type Term = {

    child?: [Term, Term];

} & (OperatorNode | ValueNode);

type OperatorNode = {

    operator: string;

};

type ValueNode = {

    value: Factor;

};

type TermNode = {

    term: Term;

};

export type Expression = {

    child?: [Expression, Expression];

} & (OperatorNode | TermNode);

export type Expressions = {

    expressions: Expression[];

};
