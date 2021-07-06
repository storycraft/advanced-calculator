/*
 * Created on Tue Jul 06 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { Program } from "../component/mod.ts";
import { VMContext } from "./context.ts";
import { ACFunction } from "./function.ts";
import { Variable } from "./variable.ts";

export * from './context.ts';
export * from './variable.ts';
export * from './function.ts';

export class ACVirtualMachine {

    constructor(private _program: Program) {
        
    }

    run(root?: VMContext): Variable | void {
        const ctx = root ?? new VMContext();

        const rootFunc = new ACFunction({
            func: 'func',
            ident: { value: 'root' },
            body: this._program,
            args: { idents: [] }
        });

        return rootFunc.run(ctx, []);
    }

}
