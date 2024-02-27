import { writeFileSync } from "fs";
import { lexicographicSortSchema, printSchema } from "graphql";
import { schema } from "../src/lib/server/schema";

const schemaAsString = printSchema(lexicographicSortSchema(schema));
writeFileSync("src/queries/schema.graphql", schemaAsString);
