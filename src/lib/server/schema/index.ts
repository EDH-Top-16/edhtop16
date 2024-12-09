import "./commander";
import "./entry";
import "./player";
import "./tournament";
import "./card";

import { builder } from "./builder";

export const schema = builder.toSchema();
