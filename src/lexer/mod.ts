/*
 * Created on Wed Feb 24 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { Token } from "./tokens.ts";
import * as readers from './readers.ts';

export type ReadInfo = {
    read: number;
    token: Token;
}

export interface CodeReader {

    read(section: string): null | ReadInfo;

}

const READER_LIST: CodeReader[] = [
    readers.SEMICOLON,

    readers.COMMA,

    readers.FUNC,
    readers.RETURN,
    readers.IF,
    readers.ELSE,
    readers.FOR,
    readers.WHILE,

    readers.CONSTANT,
    readers.VARIABLE,

    readers.PARENTHESIS,
    readers.BRACE,
    readers.BRACKET,

    readers.OPERATOR,
    readers.COMPARATOR,

    readers.NUMBER,
    readers.STRING,

    readers.IDENTIFIER
];

export type LexReadResult = {
    read: number;
    err?: { line: number, at: number };
}

export type LexResult = {
    tokens: Token[]
}

export class ACLexer {
    
    private _readSize: number = 0;
    private _readLine: number = 0;

    private _read: Token[] = [];

    initialize() {
        this._readLine = 0;
        this._readSize = 0;
        this._read = [];
    }

    get readLine() {
        return this._readLine;
    }

    get readSize() {
        return this._readSize;
    }

    parse(codeSection: string): LexReadResult {
        const lines = codeSection.split('\n');

        let readSize = 0;
        let readLine = 0;
        for (const line of lines) {
            let sectionSize = 0;
            for (const section of line.split(' ')) {
                if (section.length <= 0) continue;

                let part = section;

                let processed = true;
                while (processed && part.length > 0) {
                    processed = false;
    
                    for (const reader of READER_LIST) {
                        const readInfo = reader.read(part);
                        if (readInfo) {
                            part = part.substr(readInfo.read);
                            this._read.push(readInfo.token);
                            processed = true;
                            break;
                        }
                    }
                }

                if (part.length > 0) {
                    return {
                        read: readSize + sectionSize,
                        err: { line: this._readLine + readLine, at: sectionSize }
                    }
                }
                
                sectionSize += section.length + 1;
            }

            readSize += sectionSize + 1;
            readLine++;
        }

        this._readSize += readSize;
        this._readLine += readLine;

        return { read: readSize };
    }

    finish(): LexResult {
        const tokens = this._read;

        this.initialize();

        return { tokens };
    }

}