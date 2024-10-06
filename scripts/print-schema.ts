import { writeFileSync } from "fs";
import { lexicographicSortSchema, printSchema } from "graphql";
import { schema } from "../src/lib/server/schema";
import { format } from "prettier";

format(printSchema(lexicographicSortSchema(schema)), {
  parser: "graphql",
}).then((schemaAsString) => {
  writeFileSync("src/queries/schema.graphql", schemaAsString);
});
