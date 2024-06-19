import { z } from "zod";

const createFormSchema = z.object({
  title: z.string(),
});
