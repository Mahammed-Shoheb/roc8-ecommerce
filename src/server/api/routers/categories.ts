import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

type data = {
  id: string;
  name: string;
  isChecked: boolean;
};
export const categoriesRouter = createTRPCRouter({
  getAllCategories: privateProcedure
    .input(z.object({ page: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.user?.verified !== true)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User is not verified",
          });

        let categories = await ctx.db.userCategory.findMany({
          where: {
            userId: ctx.user?.id,
          },
          orderBy: {
            categoryId: "asc",
          },
        });
        if (!categories)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not found",
          });
        const totalCategories = categories.length;
        const page = input.page || 1;
        const perPage = 7;
        const skip = (page - 1) * perPage;
        const numOfPages = Math.ceil(totalCategories / perPage);
        categories = categories.slice(skip, skip + perPage);
        const data: data[] = [];
        const categoryPromise = categories.map(async (category) => {
          const result = await ctx.db.category.findUnique({
            where: {
              id: category.categoryId,
            },
            select: {
              name: true,
            },
          });

          data.push({
            id: category.categoryId,
            name: result!.name,
            isChecked: category.isChecked,
          });
        });
        await Promise.all(categoryPromise);
        return {
          numOfPages,
          categories: data,
        };
      } catch (error) {
        throw error;
      }
    }),

  updateCategory: privateProcedure
    .input(z.object({ catagoryId: z.string(), isChecked: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.user?.verified !== true)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User is not verified",
          });
        const data = await ctx.db.userCategory.update({
          where: {
            userId_categoryId: {
              userId: ctx.user.id,
              categoryId: input.catagoryId,
            },
          },
          data: {
            isChecked: input.isChecked,
          },
        });
        return { success: true, category: data };
      } catch (error) {
        throw error;
      }
    }),
});
