"use client";

import { LoginUserInput } from "lib/user-schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { api } from "~/trpc/react";
import { wrtieToStorage } from "~/utils/storage";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<LoginUserInput>({ email: "", password: "" });
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const { mutate: loginFn } = api.user.login.useMutation({
    onMutate() {
      setSubmitting(true);
    },
    onSettled() {
      setSubmitting(false);
    },
    onError(error) {
      if (error.data?.zodError?.fieldErrors.password) {
        error.data?.zodError?.fieldErrors.password.map((err) =>
          toast.error(err),
        );
      }
      if (error.data?.zodError?.fieldErrors.email) {
        error.data?.zodError?.fieldErrors.email.map((err) => toast.error(err));
      }
      if (error.data?.code == "UNAUTHORIZED") {
        toast.error(error.message);
      }
      setUser({ ...user, password: "" });
    },
    onSuccess(data) {
      toast.success("Login successful");
      wrtieToStorage("user", data.user);
      console.log(data.user.verified);
      if (!data?.user.verified) {
        void router.push("/sign-up/verify-email");
        return;
      }
      void router.push("/");
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    loginFn(user);
  };
  return (
    <main className="grid  place-items-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="m-5 flex flex-col rounded-xl border p-12 sm:min-w-[35%]  "
      >
        <h2 className="mb-5 text-center text-2xl font-bold">Login</h2>
        <h3 className="mb-3 text-center text-2xl font-semibold">
          Welcome back to ECOMMERCE
        </h3>
        <p className="text-center">The next gen business marketplace</p>
        <div className="mb-6 flex flex-col gap-y-1">
          <label htmlFor="emial" className="capitalize">
            email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder={"Enter"}
            onChange={handleChange}
            value={user.email}
            className="rounded-md border p-2"
            required
          />
        </div>
        <div className="relative mb-6 flex flex-col gap-y-1">
          <label htmlFor="password" className="capitalize">
            password
          </label>
          <input
            type={`${showPassword ? "text" : "password"}`}
            placeholder={"Enter"}
            onChange={handleChange}
            value={user.password}
            name="password"
            className=" rounded-md border p-2"
            id="password"
            required
          />
          <button
            type="button"
            onClick={() => {
              setShowPassword((prev) => !prev);
            }}
            className="absolute right-3 top-[50%] capitalize underline "
          >
            {`${showPassword ? "hide" : "show"}`}
          </button>
        </div>
        <button
          type="submit"
          className="mb-9 rounded-md bg-black p-3 text-sm uppercase tracking-wide text-white hover:bg-gray-700 disabled:cursor-wait disabled:bg-gray-700"
          disabled={submitting}
        >
          {submitting ? "logging in..." : "login"}
        </button>
        <p className=" text-center">
          Don't have an Account?{" "}
          <Link
            href={"/sign-up"}
            className="font-semibold uppercase tracking-wide hover:text-gray-700"
          >
            sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
