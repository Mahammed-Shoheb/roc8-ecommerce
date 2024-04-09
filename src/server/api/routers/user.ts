import { cookies } from "next/headers";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { generateAccessToken } from "~/utils/jwt";
import { compare, hash } from "bcrypt";
import { TRPCError } from "@trpc/server";
import {
  loginUserSchema,
  otpUserSchema,
  signUpUserSchema,
} from "lib/user-schema";
import sendOTP from "~/utils/sendOTP";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const userRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(signUpUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const hashedPassword = await hash(input.password, 12);
        const categories = await ctx.db.category.findMany({});

        const { otp, expires } = await sendOTP(input.email, input.name);

        const newUser = await ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
            otp: otp,
            otpExpires: new Date(expires),
          },
        });
        const userCategories = categories.map((category) => ({
          userId: newUser.id,
          categoryId: category.id,
        }));
        await ctx.db.userCategory.createMany({
          data: userCategories,
        });

        const token = generateAccessToken(newUser.id);
        // ctx.headers.set("Authorization", `Bearer ${token}`);
        const cookieOptions = {
          httpOnly: true,
          path: "/",
          secure: true,
          maxAge: 60 * 60,
        };
        cookies().set("Authorization", `Bearer ${token}`, cookieOptions);
        return {
          user: {
            name: newUser.name,
            email: newUser.email,
            verified: newUser.verified,
          },
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Email already exists",
            });
          }
        }

        throw error;
      }
    }),

  verfiyUserEmail: privateProcedure
    .input(otpUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: {
            id: ctx.user?.id,
          },
        });
        if (!user)
          throw new TRPCError({ code: "NOT_FOUND", message: "No user found" });
        if (!user.otp || !user.otpExpires || user.otp !== input.otp) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Invalid OTP" });
        }
        if (Date.now() > user.otpExpires.getTime()) {
          throw new TRPCError({
            message: "OTP expired",
            code: "PRECONDITION_FAILED",
          });
        }
        const updatedUser = await ctx.db.user.update({
          where: { id: user.id },
          data: { otp: null, otpExpires: null, verified: true },
          select: { name: true, email: true, verified: true },
        });
        return { user: updatedUser };
      } catch (error) {
        throw error;
      }
    }),

  login: publicProcedure
    .input(loginUserSchema)
    .mutation(async ({ ctx, input }) => {
      // ctx.headers.set("Authorization", `Bearer ${token}`);
      try {
        const user = await ctx.db.user.findUnique({
          where: {
            email: input.email,
          },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            verified: true,
          },
        });

        if (user === null)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Incorrect username or password.",
          });
        const validPassword = await compare(input.password, user.password);
        if (!validPassword)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Incorrect username or password.",
          });

        const token = generateAccessToken(user.id);
        const cookieOptions = {
          httpOnly: true,
          path: "/",
          secure: true,
          maxAge: 60 * 60,
        };
        cookies().set("Authorization", `Bearer ${token}`, cookieOptions);
        return {
          user: {
            name: user?.name,
            email: user?.email,
            verified: user.verified,
          },
        };
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect username or password.",
        });
      }
    }),

  isUserAutehnticated: privateProcedure.query(({ ctx }) => {
    if (ctx.user) {
      return { isAuthenticated: true };
    } else {
      return { isAuthenticated: false };
    }
  }),
});
