import { writeFileSync } from "fs";
import { lexicographicSortSchema, printSchema } from "graphql";
import { format } from "prettier";
import { schema } from "../src/lib/server/schema";

format(printSchema(lexicographicSortSchema(schema)), {
  parser: "graphql",
}).then((schemaAsString) => {
  writeFileSync("__generated__/schema.graphql", schemaAsString);
});
