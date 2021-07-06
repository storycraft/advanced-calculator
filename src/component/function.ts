/*
 * Created on Thu Jun 24 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { Ident, Expressions, Idents, ProgramBody } from "./mod.ts";

export type FunctionCall = {

    func: Ident;
    args: Expressions;

};

export type FunctionDecl = {

    func: string;

    ident: Ident;

    args: Idents;
    
    body: ProgramBody;

};
