import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be less than 2000 characters"),
  postId: z.string().cuid("Invalid post ID"),
  parentId: z.string().cuid("Invalid parent ID").optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

