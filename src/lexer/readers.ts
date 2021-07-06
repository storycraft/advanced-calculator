/*
 * Created on Wed Feb 24 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */
import { CodeReader } from "./mod.ts";
import { TokenType } from "./tokens.ts";

export const SEMICOLON: CodeReader = {
    read(section) {
        if (!section.startsWith(';')) return null;

        return { read: 1, token: { type: TokenType.SEMICOLON, value: ';' } };
    }
}

export const COMMA: CodeReader = {
    read(section) {
        if (!section.startsWith(',')) return null;

        return { read: 1, token: { type: TokenType.COMMA, value: ',' } };
    }
}

export const NUMBER: CodeReader = {
    read(section) {
        const match = section.match(/^((0x[0-9|a-f|A-F]+)|(0b[0-1]+)|((?![a-z])[0-9|\.]+))/);
        if (!match) return null;
        const value = match[0];

        return { read: value.length, token: { type: TokenType.NUMBER, value } };
    }
}

export const STRING: CodeReader = {
    read(section) {
        const match = section.match(/^"(.+?)"/);
        if (!match) return null;
        const value = match[0];

        return { read: value.length, token: { type: TokenType.STRING, value } };
    }
}

export const FUNC: CodeReader = {
    read(section) {
        if (section !== 'func') return null;

        return { read: 4, token: { type: TokenType.FUNC, value: 'func' } };
    }
}

export const RETURN: CodeReader = {
    read(section) {
        if (section !== 'ret') return null;

        return { read: 3, token: { type: TokenType.RETURN, value: 'ret' } };
    }
}

export const IF: CodeReader = {
    read(section) {
        if (section !== 'if') return null;

        return { read: 2, token: { type: TokenType.IF, value: 'if' } };
    }
}

export const ELSE: CodeReader = {
    read(section) {
        if (section !== 'else') return null;

        return { read: 4, token: { type: TokenType.ELSE, value: 'else' } };
    }
}

export const FOR: CodeReader = {
    read(section) {
        if (section !== 'for') return null;

        return { read: 3, token: { type: TokenType.FOR, value: 'for' } };
    }
}

export const WHILE: CodeReader = {
    read(section) {
        if (section !== 'while') return null;

        return { read: 5, token: { type: TokenType.WHILE, value: 'while' } };
    }
}

export const CONSTANT: CodeReader = {
    read(section) {
        if (section !== 'const') return null;

        return { read: 5, token: { type: TokenType.CONSTANT, value: 'const' } };
    }
}

export const VARIABLE: CodeReader = {
    read(section) {
        if (section !== 'let') return null;

        return { read: 3, token: { type: TokenType.VARIABLE, value: 'let' } };
    }
}

export const PARENTHESIS: CodeReader = {
    read(section) {
        if (section.startsWith('(')) return { read: 1, token: { type: TokenType.LEFT_PARENTHESIS, value: section[0] } };
        else if (section.startsWith(')')) return { read: 1, token: { type: TokenType.RIGHT_PARENTHESIS, value: section[0] } };

        return null;
    }
}

export const BRACE: CodeReader = {
    read(section) {
        if (section.startsWith('{')) return { read: 1, token: { type: TokenType.LEFT_BRACE, value: section[0] } };
        else if (section.startsWith('}')) return { read: 1, token: { type: TokenType.RIGHT_BRACE, value: section[0] } };

        return null;
    }
}

export const BRACKET: CodeReader = {
    read(section) {
        if (section.startsWith('[')) return { read: 1, token: { type: TokenType.LEFT_BRACKET, value: section[0] } };
        else if (section.startsWith(']')) return { read: 1, token: { type: TokenType.RIGHT_BRACKET, value: section[0] } };

        return null;
    }
}

export const OPERATOR: CodeReader = {
    read(section) {
        if (
            section.startsWith('+') ||
            section.startsWith('-') ||
            section.startsWith('*') || 
            section.startsWith('/') || 
            section.startsWith('^') || 
            section.startsWith('%')
        ) {
            return { read: 1, token: { type: TokenType.OPERATOR, value: section[0] } };
        } else if (
            section.startsWith('+=') ||
            section.startsWith('-=') ||
            section.startsWith('*=') ||
            section.startsWith('/=') ||
            section.startsWith('%=') ||
            section.startsWith('^=') ||
            section.startsWith('++') || 
            section.startsWith('--')
        ) {
            return { read: 2, token: { type: TokenType.OPERATOR, value: section.substr(0, 2) } };
        } else if (
            section.startsWith('=')
        ) {
            return { read: 1, token: { type: TokenType.EQUAL, value: section[0] } };
        }

        return null;
    }
}

export const COMPARATOR: CodeReader = {
    read(section) {
        if (
            section.startsWith('>') ||
            section.startsWith('<')
        ) {
            return { read: 1, token: { type: TokenType.COMPARATOR, value: section[0] } };
        } else if (
            section.startsWith('>=') ||
            section.startsWith('<=') ||
            section.startsWith('==') || 
            section.startsWith('!=')
        ) {
            return { read: 2, token: { type: TokenType.COMPARATOR, value: section.substr(0, 2) } };
        }

        return null;
    }
}

export const IDENTIFIER: CodeReader = {
    read(section) {
        const match = section.match(/^(?![0-9])[A-Z|a-z|_|0-9]+/);
        if (!match) return null;
        const value = match[0];

        return { read: value.length, token: { type: TokenType.IDENTIFIER, value } };
    }
}