/*
 * Created on Tue Jun 22 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { DynamicValue, Expression, Expressions, FunctionCall, Ident, Numberic, Term, Factor, VariableDecl, Equation, Condition, Idents, FunctionDecl, Statement, ProgramBody, Program, Return } from "../component/mod.ts";
import { TokenType } from "../lexer/tokens.ts";
import { ParserBuffer } from "./mod.ts";

export interface RuleSet<T> {

    /**
     * @return T | null
     */
    accept: (buf: ParserBuffer) => T | null;

};

/// Numberic -> NUMBER | -NUMBER | +NUMBER
export const NUMBERIC: RuleSet<Numberic> = {

    accept(buf: ParserBuffer): Numberic | null {
        const first = buf.peek();

        if (!first) return null;

        if (
            first.type === TokenType.NUMBER
        ) {
            buf.next();
            return { number: first.value };
        } else if (
            first.type === TokenType.OPERATOR &&
            (first.value === '+' || first.value === '-')
        ) {
            const second = buf.peek(1);
            if (!second || second.type !== TokenType.NUMBER) return null;

            buf.next(); buf.next();
            return { plusMinusPrefix: first.value, number: second.value };
        }

        return null;
    }

}

/// Ident -> IDENTIFIER
export const IDENT: RuleSet<Ident> = {

    accept(buf: ParserBuffer): Ident | null {
        const first = buf.peek();
        if (first?.type !== TokenType.IDENTIFIER) return null;

        buf.next();
        return { value: first.value };
    }

}

/// Idents -> Ident, Idents
export const IDENTS: RuleSet<Idents> = {

    accept(buf: ParserBuffer): Idents | null {
        const list = applyList(IDENT, TokenType.COMMA, buf);

        if (!list) return null;

        return { idents: list };
    }

}

/// Dynamic -> Ident(Values) | Ident
export const DYNAMIC_VALUE: RuleSet<DynamicValue> = {

    accept(buf: ParserBuffer): DynamicValue | null {
        const ident = IDENT.accept(buf);

        if (!ident) return null;

        const args = applyParenthesis(EXPRESSIONS, buf);
        if (args) {
            return { type: 'FNCALL', value: { func: ident, args } };
        }

        return { type: 'VARIABLE', value: ident };
    }

}

/// Factor -> (Expression) | Dynamic | Numberic
export const FACTOR: RuleSet<Factor> = {

    accept(buf: ParserBuffer): Factor | null {
        const expr = applyParenthesis(EXPRESSION, buf);
        if (expr) return { type: 'EXPRESSION', value: expr };

        const dynamic = DYNAMIC_VALUE.accept(buf);
        if (dynamic) return { type: 'DYNAMIC', value: dynamic };

        const numberic = NUMBERIC.accept(buf);
        if (numberic) return { type: 'STATIC', value: numberic };

        return null;
    }

}

/// Expressions -> Expression | Expression, Expressionss
export const EXPRESSIONS: RuleSet<Expressions> = {

    accept(buf: ParserBuffer): Expressions | null {
        const list = applyList(EXPRESSION, TokenType.COMMA, buf);

        if (!list) return null;

        return { expressions: list };
    }

}

/// Term -> Factor | Term * Term | Term / Term | Term % Term
export const TERM: RuleSet<Term> = {

    accept(buf: ParserBuffer): Term | null {
        const leftVal = FACTOR.accept(buf);

        if (!leftVal) return null;

        const left = { value: leftVal };

        const operator = buf.peek();
        if (
            !operator ||
            operator.type !== TokenType.OPERATOR ||
            operator.value !== '*' &&
            operator.value !== '/' &&
            operator.value !== '%'
        ) return left;

        buf.next();

        const rightVal = this.accept(buf);
        if (!rightVal) {
            buf.next(-1);
            return null;
        }

        return { operator: operator.value, child: [left, rightVal] };
    }

}

/// Expression -> Term | Expression + Expression | Expression - Expression
export const EXPRESSION: RuleSet<Expression> = {

    accept(buf: ParserBuffer): Expression | null {
        const leftTerm = TERM.accept(buf);

        if (!leftTerm) return null;

        let left: Expression = { term: leftTerm };

        const operator = buf.peek();
        if (
            !operator ||
            operator.type !== TokenType.OPERATOR ||
            operator.value !== '+' &&
            operator.value !== '-'
        ) {
            return left;
        }

        buf.next();

        const rightExp = this.accept(buf);
        if (!rightExp) {
            buf.next(-1);
            return null;
        }

        return { operator: operator.value, child: [left, rightExp] };
    }

}

/// Equation -> Ident = Expression
export const EQUATION: RuleSet<Equation> = {

    accept(buf: ParserBuffer): Equation | null {
        buf.pushIndex();
        const ident = IDENT.accept(buf);

        if (!ident) return null;

        const eq = buf.peek();
        if (eq?.type !== TokenType.EQUAL) {
            buf.index = buf.popIndex();
            return null;
        }
        buf.next();

        const expression = EXPRESSION.accept(buf);

        if (!expression) {
            buf.index = buf.popIndex();
            return null;
        }

        buf.popIndex();

        return { left: ident, eq: eq.value, right: expression };
    }

};

/// Condition -> Expression (! | < | > | =)= Expression | Expression (< | >) Expression
export const CONDITION: RuleSet<Condition> = {

    accept(buf: ParserBuffer): Condition | null {
        buf.pushIndex();

        const left = EXPRESSION.accept(buf);

        if (!left) return null;

        const comparator = buf.peek();
        if (!comparator || 1 > 3) { // TODO
            buf.index = buf.popIndex();
            return null;
        }

        buf.next();

        const right = EXPRESSION.accept(buf);

        if (!right) {
            buf.index = buf.popIndex();
            return null;
        }

        buf.popIndex();

        return { left, comparator: comparator.value, right };
    }

};

/// VariableDecl -> (let | const) Equation
export const VARIABLE_DECL: RuleSet<VariableDecl> = {

    accept(buf: ParserBuffer): VariableDecl | null {
        const varToken = buf.peek();

        if (!varToken || varToken.type !== TokenType.CONSTANT && varToken.type !== TokenType.VARIABLE) return null;
        buf.next();

        const equation = EQUATION.accept(buf);
        if (!equation) {
            buf.next(-1);

            return null;
        }

        return { type: varToken.value, equation };
    }

};

export const RETURN: RuleSet<Return> = {

    accept(buf: ParserBuffer): Return | null {
        if (buf.peek()?.type !== TokenType.RETURN) return null;
        buf.next();
        
        const expression = EXPRESSION.accept(buf);
        if (!expression) {
            buf.next(-1);
            return null;
        }

        return { expression };
    }
};

/// Statement -> FunctionDecl | (Expression | VariableDecl | Return);
export const STATEMENT: RuleSet<Statement> = {

    accept(buf: ParserBuffer): Statement | null {
        const functionDecl = FUNCTION_DECL.accept(buf);
        if (functionDecl) return { type: 'FUNCTION_DECL', value: functionDecl };

        buf.pushIndex();
        
        const expression = EXPRESSION.accept(buf);
        if (expression && buf.peek()?.type === TokenType.SEMICOLON) {
            buf.popIndex();
            return { type: 'EXPRESSION', value: expression };
        }

        buf.index = buf.peekIndex();
        
        const variableDecl = VARIABLE_DECL.accept(buf);
        if (variableDecl && buf.next()?.type === TokenType.SEMICOLON) {
            buf.popIndex();
            return { type: 'VARIABLE_DECL', value: variableDecl };
        }

        buf.index = buf.peekIndex();
        
        const ret = RETURN.accept(buf);
        if (ret && buf.next()?.type === TokenType.SEMICOLON) {
            buf.popIndex();
            return { type: 'RETURN', value: ret };
        }

        buf.index = buf.popIndex();
        return null;
    }

};

/// ProgramBody -> Sentence ProgramBody
export const PROGRAM_BODY: RuleSet<ProgramBody> = {

    accept(buf: ParserBuffer): ProgramBody | null {
        const body: ProgramBody = { sentences: [] };

        for (let sentence = STATEMENT.accept(buf); sentence; sentence = STATEMENT.accept(buf)) {
            body.sentences.push(sentence);
        }

        return body;
    }

};

/// FunctionDecl -> func Ident(Idents) { ProgramBody }
export const FUNCTION_DECL: RuleSet<FunctionDecl> = {

    accept(buf: ParserBuffer): FunctionDecl | null {
        const func = buf.peek();

        if (func?.type !== TokenType.FUNC) return null;

        buf.pushIndex();
        
        buf.next();

        const ident = IDENT.accept(buf);

        if (!ident) {
            buf.index = buf.popIndex();
            return null;
        }

        const args = applyParenthesis(IDENTS, buf);
        if (!args) {
            buf.index = buf.popIndex();
            return null;
        }

        const leftBrace = buf.peek();
        if (leftBrace?.type !== TokenType.LEFT_BRACE) {
            buf.index = buf.popIndex();
            return null;
        }
        buf.next();

        const body = PROGRAM_BODY.accept(buf);
        if (!body) {
            buf.index = buf.popIndex();
            return null;
        }

        const rightBrace = buf.peek();
        if (rightBrace?.type !== TokenType.RIGHT_BRACE) {
            buf.index = buf.popIndex();
            return null;
        }
        buf.next();

        buf.popIndex();
        
        return { func: func.value, ident, args, body };
    }

}

/// Program -> ProgramBody
export const PROGRAM: RuleSet<Program> = {

    accept(buf: ParserBuffer): Program | null {
        const body = PROGRAM_BODY.accept(buf);
        return body;
    }

};

export function applyParenthesis<T>(innerRule: RuleSet<T>, buf: ParserBuffer): T | null {
    const parenthesis = buf.peek();
    if (parenthesis?.type !== TokenType.LEFT_PARENTHESIS) return null;

    buf.pushIndex();
    buf.next();

    let val = innerRule.accept(buf);
    if (!val) {
        buf.index = buf.popIndex();
        return null;
    }

    if (buf.peek()?.type !== TokenType.RIGHT_PARENTHESIS) {
        buf.index = buf.popIndex();
        return null;
    }

    buf.next();
    buf.popIndex();

    return val;
}

export function applyList<T>(innerRule: RuleSet<T>, separateType: TokenType, buf: ParserBuffer): T[] | null {
    const list = [];
    const val = innerRule.accept(buf);
    if (!val) return [];

    list.push(val);

    for (let separator = buf.peek(); separator && separator.type === separateType; separator = buf.peek()) {
        buf.next();

        const val = innerRule.accept(buf);

        if (!val) {
            buf.next(-1);
            break;
        }

        list.push(val);
    }

    return list;
}
