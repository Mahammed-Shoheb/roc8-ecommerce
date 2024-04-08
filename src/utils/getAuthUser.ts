"use server";

import { redirect } from "next/navigation";
import { createAsyncCaller } from "~/server/api/root";

export const getAuthUser = async () => {
  const caller = await createAsyncCaller();
  return await caller.user
    .isUserAutehnticated()
    .then(({ isAuthenticated }) => {
      if (!isAuthenticated) redirect("/login");
    })
    .catch(async (error) => {
      // if (error.code !== "auth/required") throw error;
      redirect("/login");
    });
};
