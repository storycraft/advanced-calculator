/*
 * Created on Tue Jul 06 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { Expression, Factor, Statement, Term } from "../component/mod.ts";
import { ACFunction, RunnableFunction, Variable } from "./mod.ts";

export class VMContext {

    private _variableMap: Map<string, Variable>;

    constructor(private _parentContext?: VMContext) {
        this._variableMap = new Map();
    }

    getVariable(name: string): Variable | void {
        return this._variableMap.get(name) ?? this._parentContext?.getVariable(name);
    }

    getFunction(name: string): RunnableFunction | void {
        const variable = this.getVariable(name);
        if (variable && variable.type === 'function') {
            return variable.value.value;
        }
    }

    declareVariable(name: string, variable: Variable) {
        const lastDecl = this._variableMap.get(name);
        if (lastDecl && lastDecl.value.modifier === 'const') {
            throw new Error(`Constant ${name} is already defined`);
        }

        this._variableMap.set(name, variable);
    }

    evalStatement(ctx: VMContext, statement: Statement): Variable | void {
        switch (statement.type) {
            case 'RETURN': return { type: 'number', value: { modifier: 'const', value: this.evalExpression(ctx, statement.value.expression) } };

            case 'EXPRESSION': return { type: 'number', value: { modifier: 'const', value: this.evalExpression(ctx, statement.value) } };

            case 'VARIABLE_DECL': {
                const varDecl = statement.value;
                const name = varDecl.equation.left.value;
                const variable: Variable = {
                    type: 'number',
                    value: {
                        modifier: varDecl.type,
                        value: this.evalExpression(ctx, varDecl.equation.right)
                    } 
                };

                this.declareVariable(name, variable);
                return variable;
            }

            case 'FUNCTION_DECL': {
                const funcDecl = statement.value;
                const func: Variable = {
                    type: 'function',
                    value: {
                        modifier: 'const',
                        value: new ACFunction(funcDecl)
                    } 
                };

                this.declareVariable(funcDecl.ident.value, func);

                return func;
            }
        }

    }

    evalExpression(ctx: VMContext, expr: Expression): number {
        if ('operator' in expr) {
            if (!expr.child) throw new Error(`Cannot find child expression`);

            const left = ctx.evalExpression(ctx, expr.child[0]);
            const right = ctx.evalExpression(ctx, expr.child[1]);

            switch (expr.operator) {

                case '+': return left + right;
                case '-': return left - right;

                default: throw new Error(`Invalid operator '${expr.operator}'`);
            }
        } else if ('term' in expr) {
            return this.evalTerm(ctx, expr.term);
        }

        throw new Error('Invalid expression');
    }

    private evalTerm(ctx: VMContext, term: Term): number {
        if ('operator' in term) {
            if (!term.child) throw new Error(`Cannot find child term`);

            const left = ctx.evalTerm(ctx, term.child[0]);
            const right = ctx.evalTerm(ctx, term.child[1]);

            switch (term.operator) {
                
                case '*': return left * right;
                case '/': return left / right;
                case '%': return left % right;

                default: throw new Error(`Invalid operator '${term.operator}'`);
            }
        } else if ('value' in term) {
            return this.evalFactor(ctx, term.value);
        }

        throw new Error('Invalid term');
    }

    private evalFactor(ctx: VMContext, factor: Factor): number {
        switch (factor.type) {
            case 'EXPRESSION': return this.evalExpression(ctx, factor.value);

            case 'DYNAMIC': {
                switch (factor.value.type) {
                    case 'FNCALL': {
                        const fnCall = factor.value.value;
                        const name = fnCall.func.value;

                        const fn = this.getFunction(name);
                        if (!fn) throw new Error(`Cannot find function '${name}'`);

                        const args: Variable[] = [];
                        for (const expr of fnCall.args.expressions) {
                            args.push({
                                type: 'number',
                                value: {
                                    modifier: 'let',
                                    value: this.evalExpression(ctx, expr)
                                }
                            });
                        }

                        const res = fn.run(ctx, args);
                        if (!res) throw new Error(`Function '${name}' returns void`);
                        if (res.type !== 'number') throw new Error(`Function '${name}' does not return number`);

                        return res.value.value;
                    }

                    case 'VARIABLE': {
                        const ident = factor.value.value;
                        const name = ident.value;
                        const variable = this.getVariable(name);
                        
                        if (!variable) throw new Error(`Variable '${name}' is not defined`);
                        if (variable.type !== 'number') throw new Error(`Variable '${name}' is not number`);

                        return variable.value.value;
                    }
                }
                
                throw new Error('Invalid dynamic value');
            }

            case 'STATIC': {
                const strNum = factor.value.number;
                let num: number;
                if (strNum.startsWith('0x')) {
                    num = Number.parseInt(factor.value.number.slice(2), 16);
                } else if (strNum.startsWith('0b')) {
                    num = Number.parseInt(factor.value.number.slice(2), 2);
                } else {
                    num = Number.parseFloat(factor.value.number);
                }

                if (isNaN(num)) throw new Error('NaN value');

                if (factor.value.plusMinusPrefix === '-') return -num;

                return num;
            }
        }

        throw new Error('Invalid factor value');
    }

}
