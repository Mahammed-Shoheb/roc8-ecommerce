"use server";

import type { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";
import { createAsyncCaller } from "~/server/api/root";

export const getAuthUser = async () => {
  const caller = await createAsyncCaller();
  return await caller.user
    .isUserAutehnticated()
    .then(({ isAuthenticated }) => {
      if (!isAuthenticated) redirect("/login");
    })
    .catch((error: TRPCError) => {
      if (error.code !== "UNAUTHORIZED") throw error;
      redirect("/login");
    });
};
