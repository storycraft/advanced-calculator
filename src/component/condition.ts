/*
 * Created on Fri Jun 25 2021
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { Expression } from "./mod.ts";

export type Condition = {

    left: Expression;

    comparator: string;

    right: Expression;

};
