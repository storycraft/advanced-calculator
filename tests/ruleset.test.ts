/*
 * Created on Tue Jun 22 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { ACLexer } from "../src/lexer/mod.ts";
import { ACParser } from "../src/parser/mod.ts";

export {};

const CODES = [`
func abcd(a, b) {
    ret ((3+b)*((-21/-5))+2*a*+19.82*pow(5, fa + 5))/1-2;
}

let a = 2;

let hex = 0x12f3;
let bin = 0b110101010;
abcd(1, 2);
`
];
Deno.test("Ruleset", () => {
    for (const code of CODES) {
        const lex = new ACLexer();
        lex.parse(code);
        const res = lex.finish();
        console.log(res);

        const parser = new ACParser();

        const result = parser.parse(res.tokens);

        console.log(JSON.stringify(result, null, 1));
    }
    
});