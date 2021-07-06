/*
 * Created on Wed Feb 24 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

export enum TokenType {
    SEMICOLON = 0,
    
    NUMBER = 1,
    STRING = 2,

    COMMA = 4,

    FUNC = 64,
    RETURN = 65,
    IF = 66,
    ELSE = 67,
    FOR = 68,
    WHILE = 69,

    CONSTANT = 128,
    VARIABLE = 129,
    
    LEFT_PARENTHESIS = 256,
    RIGHT_PARENTHESIS = 257,
    LEFT_BRACE = 257,
    RIGHT_BRACE = 258,
    LEFT_BRACKET = 258,
    RIGHT_BRACKET = 258,
    
    OPERATOR = 512,
    EQUAL = 513,
    COMPARATOR = 514,

    IDENTIFIER = 1024,
}

export type Token = {
    type: TokenType;
    value: string;
}

