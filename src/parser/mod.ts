/*
 * Created on Wed Feb 24 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { Program } from "../component/mod.ts";
import { Token } from "../lexer/tokens.ts";
import { PROGRAM } from "./ruleset.ts";

export * from './ruleset.ts';

export class ACParser {

    constructor() {
        
    }

    parse(list: Token[]): Program {
        const buffer = new ParserBuffer(list);

        const program = PROGRAM.accept(buffer);

        if (!program) throw new Error('Failed parsing');

        return program;
    }

}

export class ParserBuffer {

    private _index: number;
    private _indexStack: number[];

    constructor(private _list: Token[]) {
        this._index = 0;
        this._indexStack = [];
    }

    get index() {
        return this._index;
    }

    set index(index) {
        this._index = index;
    }

    pushIndex() {
        this._indexStack.push(this._index);
    }

    popIndex(): number {
        const index = this._indexStack.pop();
        if (!index) return this._index;
        
        return index;
    }

    peekIndex(): number {
        const index = this._indexStack[this._indexStack.length - 1];
        if (!index) return this._index;
        
        return index;
    }

    clearIndexStack() {
        this._indexStack = [];
    }

    peek(skip: number = 0): Token | undefined {
        return this._list[this._index + skip];
    }

    next(skip: number = 1): Token | undefined {
        if (this._list.length > this._index) {
            let i = this._index;
            this._index += skip;

            return this._list[i];
        }
    }

}
