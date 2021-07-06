/*
 * Created on Tue Jul 06 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { FunctionDecl } from "../component/mod.ts";
import { Variable, VMContext } from "./mod.ts";

export interface RunnableFunction {

    run(parentCtx: VMContext, args: Variable[]): Variable | void;

    readonly stringDesc: string;

}

export class ACFunction implements RunnableFunction {

    constructor(private _decl: FunctionDecl) {

    }

    run(parentCtx: VMContext, args: Variable[]): Variable | void {
        const ctx = new VMContext(parentCtx);

        for (let i = 0; i < this._decl.args.idents.length; i++) {
            const ident = this._decl.args.idents[i];
            const variable = args[i];

            ctx.declareVariable(ident.value, variable);
        }

        for (const statement of this._decl.body.sentences) {
            const variable = ctx.evalStatement(ctx, statement);

            if (statement.type === 'RETURN') return variable;
        }
    }

    get stringDesc() {
        return `func ${this._decl.ident.value}`;
    }

}

export class NativeFunction implements RunnableFunction {
    
    constructor(
        public run: (parentCtx: VMContext, args: Variable[]) => Variable | void
    ) {

    }

    get stringDesc() {
        return '[native]';
    }

}
