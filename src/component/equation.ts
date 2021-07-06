/*
 * Created on Fri Jun 25 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { Expression, Ident } from "./mod.ts";

export type Equation = {

    left: Ident;
    eq: string;
    right: Expression;

}
