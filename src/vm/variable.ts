/*
 * Created on Tue Jul 06 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { Variant } from "../component/mod.ts";
import { RunnableFunction } from "./mod.ts";

export type VariableMeta<T> = {
    modifier: string,
    value: T
};

type VariableVariant<K, V> = Variant<K, VariableMeta<V>>;

export type Variable = VariableVariant<'number', number> | VariableVariant<'string', string> | VariableVariant<'function', RunnableFunction>;
