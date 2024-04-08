import { object, TypeOf, string } from "zod";

export const signUpUserSchema = object({
  name: string({ required_error: "Name is required" }).min(
    3,
    "Name must be at least  3 characters",
  ),
  email: string({
    required_error: "Email is required",
    invalid_type_error: "Invalid Email format",
  })
    .min(1, "Email is required")
    .email("Invalid Email Format"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 chracters")
    .max(32, "Password must be less than 32 chracters"),
});

export const loginUserSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid Email or Password"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required",
  ),
});

export const otpUserSchema = object({
  otp: string({ required_error: "OTP is required" })
    .min(8, "OTP should have exactly 8 digits")
    .max(8, "OTP should have exactly 8 digits"),
});

export type SignUpUserInput = TypeOf<typeof signUpUserSchema>;
export type LoginUserInput = TypeOf<typeof loginUserSchema>;
export type OTPUserInput = TypeOf<typeof otpUserSchema>;
