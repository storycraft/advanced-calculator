/*
 * Created on Wed Feb 24 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */
import { ACLexer } from "../src/lexer/mod.ts";

export {};

const CODE = `
func abcd(a, b) {
    ret a + b;
}

let a = 2;

while( a<2 ) {
    a++;
}

let hex = 0x12f3;
let bin = 0b110101010;
abcd(1, 2) + 2;
`;

Deno.test("Lexer", () => {
    const lexer = new ACLexer();

    const res = lexer.parse(CODE);

    if (res.err) {
        throw `Parsing error at ${res.err.line + 1}:${res.err.at}`;
    }

    const finish = lexer.finish();

    console.log(finish);
});