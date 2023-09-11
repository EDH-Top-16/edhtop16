import { ZodSchema } from "zod";

export function schemaValidate<
  DataType,
  SchemaType extends ZodSchema<DataType>,
>(data: DataType, schema: SchemaType) {
  try {
    const res = schema.safeParse(data);
    if (!res.success) throw new Error("Invalid filters");
  } catch (e) {
    console.log(e);
  }
}
