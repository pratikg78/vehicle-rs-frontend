import { z, ZodSchema } from "zod";

export default function validateFields(data: z.infer<typeof schema>, schema: ZodSchema) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return result.error;
  }
  return result.data;
}