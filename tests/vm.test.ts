/*
 * Created on Tue Jul 06 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { ACLexer } from "../src/lexer/mod.ts";
import { ACParser } from "../src/parser/mod.ts";
import { ACVirtualMachine, NativeFunction, VMContext } from "../src/vm/mod.ts";

export {};

const CODE = `
func plus(a, b) {
    ret a + b;
}

let hex = 0x10;
let bin = 0b11;
let dec = 5;

ret plus(hex, dec) + bin;
`;

Deno.test("VM", () => {
    const lexer = new ACLexer();

    const res = lexer.parse(CODE);

    if (res.err) {
        throw `Parsing error at ${res.err.line + 1}:${res.err.at}`;
    }

    const finish = lexer.finish();

    const parser = new ACParser();

    const program = parser.parse(finish.tokens);
    // console.log(JSON.stringify(program, null, 1));
    const vm = new ACVirtualMachine(program);
    const nativeCtx = new VMContext();

    nativeCtx.declareVariable('sqrt', {
        type: 'function',
        value: {
            modifier: 'const',
            value: new NativeFunction((parentCtx, args) => {
                if (args.length < 1) throw new Error('Require 1 arguments');
                if (args[0].type !== 'number') throw new Error('Arguments should be number');
                const res = Math.sqrt(args[0].value.value);

                return { type: 'number', value: { modifier: 'const' , value: res } };
            })
        }
    });

    console.log(vm.run(nativeCtx));
});