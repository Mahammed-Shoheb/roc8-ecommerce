"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import type { FormEvent } from "react";
import { toast } from "react-toastify";
import { api } from "~/trpc/react";
import { getAuthUser } from "~/utils/getAuthUser";
import { readFromStorage, wrtieToStorage } from "~/utils/storage";
import type { data } from "~/utils/storage";

export default function VerifyEmail() {
  const [enteredCode, setEnteredCode] = useState<string[]>(Array(8).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const verifyButtomRefs = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const length = enteredCode.length;
  const [submitting, setSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState("swapnil@gmail.com");

  useLayoutEffect(() => {
    async function checkIfauthenticated() {
      try {
        await getAuthUser();
      } catch (error) {
        toast.error("UNAUTHORIZED");
      }
    }
    void checkIfauthenticated();
  }, []);

  useEffect(() => {
    const data: data = readFromStorage("user");
    if (data.email) setUserEmail(data.email);
    if (data.verified) {
      void router.replace("/login");
    }
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [router]);

  const handleChange = (index: number, e: React.ChangeEvent<EventTarget>) => {
    const value = (e.target as HTMLInputElement).value;
    if (value.match(/[^0-9]/)) return; // only allow numbers
    const newenteredCode = [...enteredCode];
    // allow only one input
    newenteredCode[index] = value.substring(value.length - 1);
    setEnteredCode(newenteredCode);

    // submit trigger
    const combinedOtp = newenteredCode.join("");
    if (combinedOtp.length === length) {
      verifyButtomRefs.current?.focus();
    }

    // Move to next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      const i = newenteredCode.indexOf("");
      if (i == -1) {
        inputRefs?.current[length - 1]?.focus();
      } else {
        inputRefs?.current[i]?.focus();
      }
    }
  };

  const handleClick = (index: number) => {
    inputRefs?.current[index]?.setSelectionRange(1, 1);

    // optional
    if (index > 0 && !enteredCode[index - 1]) {
      inputRefs?.current[enteredCode.indexOf("")]?.focus();
    }
  };

  const displayModifiedEmail = () => {
    const newEmail =
      userEmail.split("@")[0]?.slice(0, 3) + "***@" + userEmail.split("@")[1];
    return newEmail;
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLDivElement>,
  ): void => {
    if (
      e.key === "Backspace" &&
      !enteredCode[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRefs?.current[index - 1]?.focus();
    }
  };

  const { mutate: verifyEmailFn } = api.user.verfiyUserEmail.useMutation({
    onMutate() {
      setSubmitting(true);
    },
    onSettled() {
      setSubmitting(false);
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      toast.success("OTP verified successfully, redirecting to home page");
      wrtieToStorage("user", data.user);
      void router.push("/");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    verifyEmailFn({ otp: enteredCode.join("") });
  };

  return (
    <main className="grid  place-items-center">
      <form
        onSubmit={handleSubmit}
        className="m-5 flex flex-col rounded-xl border p-4 sm:min-w-[35%] sm:p-12"
      >
        <h2 className="mb-5 text-center text-2xl font-bold">
          Verify your email
        </h2>

        <p className="mb-7 text-center">
          Enter the 8 digit code you have received on {displayModifiedEmail()}
        </p>
        <div className="mb-12 flex flex-col gap-y-1">
          <label htmlFor="digit0" className="capitalize">
            code
          </label>
          <div className="flex justify-between">
            {enteredCode.map((digit, index) => (
              <input
                id={`code-box-${index}`}
                key={index}
                value={digit}
                ref={(input) => {
                  if (input) inputRefs.current[index] = input;
                }}
                type="text"
                maxLength={1}
                name={`digit${index}`}
                onChange={(e) => handleChange(index, e)}
                onClick={() => handleClick(index)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className=" h-8 w-8 rounded-md border text-center sm:h-10  sm:w-10"
                required
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="hover:bg-gray-700disabled:bg-gray-700 mb-1 rounded-md bg-black p-3 text-sm uppercase tracking-wider text-white disabled:cursor-wait"
          disabled={submitting}
          tabIndex={0}
          ref={verifyButtomRefs}
        >
          {submitting ? "verifying..." : "verify"}
        </button>
      </form>
    </main>
  );
}
