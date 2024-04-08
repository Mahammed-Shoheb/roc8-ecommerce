"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import { wrtieToStorage } from "~/utils/storage";
import { toast } from "react-toastify";
import { SignUpUserInput } from "lib/user-schema";

export default function SignUp() {
  const [user, setUser] = useState<SignUpUserInput>({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const { mutate: signUpFn } = api.user.registerUser.useMutation({
    onMutate() {
      setSubmitting(true);
    },
    onSettled() {
      setSubmitting(false);
    },
    onError(error) {
      if (error.data?.zodError?.fieldErrors.name) {
        error.data?.zodError?.fieldErrors.name.map((err) => toast.error(err));
      }
      if (error.data?.zodError?.fieldErrors.password) {
        error.data?.zodError?.fieldErrors.password.map((err) =>
          toast.error(err),
        );
      }
      if (error.data?.zodError?.fieldErrors.email) {
        error.data?.zodError?.fieldErrors.email.map((err) => toast.error(err));
      }
      if (error.data?.code == "CONFLICT") {
        toast.error(error.message);
      }
    },
    onSuccess(data) {
      // on success, redirect to home page
      toast.success(
        "Registered successfully, redirecting to verify email with otp page",
      );
      wrtieToStorage("user", data.user);
      void router.push("/sign-up/verify-email");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signUpFn(user);
  };

  return (
    <main className="grid  place-items-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="m-5 flex flex-col rounded-xl border p-12  sm:min-w-[35%]"
      >
        <h2 className="mb-5 text-center text-2xl font-bold">
          Create your account
        </h2>
        <div className="mb-6 flex flex-col gap-y-1">
          <label htmlFor="name" className=" capitalize">
            name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder={"Enter"}
            className="rounded-md border p-2"
            onChange={handleChange}
            value={user.name}
            required
          />
        </div>
        <div className="mb-6 flex flex-col gap-y-1">
          <label htmlFor="emial" className="capitalize">
            email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder={"Enter"}
            className="rounded-md border p-2"
            onChange={handleChange}
            value={user.email}
            required
          />
        </div>
        <div className="mb-6 flex flex-col gap-y-1">
          <label htmlFor="password" className="capitalize">
            password
          </label>
          <input
            name="password"
            type="password"
            id="password"
            placeholder={"Enter"}
            onChange={handleChange}
            className="rounded-md border p-2"
            value={user.password}
            required
            minLength={8}
            maxLength={32}
          />
        </div>
        <button
          type="submit"
          className="mb-9 rounded-md bg-black p-3 text-sm uppercase tracking-wide text-white hover:bg-gray-700 disabled:cursor-wait disabled:bg-gray-700"
          disabled={submitting}
        >
          {submitting ? "creating account..." : "create account"}
        </button>
        <p className="mb-16 text-center">
          Have an Account?{" "}
          <Link
            href={"/login"}
            className="font-semibold uppercase tracking-wide hover:text-gray-700"
          >
            login
          </Link>
        </p>
      </form>
    </main>
  );
}
