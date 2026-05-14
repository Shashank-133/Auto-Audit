"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { useAuthStore } from "@/lib/store";

type Mode = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company: z.string().min(2, "Enter your company name"),
  agree: z.literal(true, { message: "You must accept the terms" }),
});

type LoginData = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;

export function AuthModal({ open, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);

  return (
    <Modal open={open} onClose={onClose} ariaLabel={mode === "login" ? "Sign in" : "Create account"}>
      {mode === "login" ? (
        <LoginForm
          submitting={submitting}
          submitError={submitError}
          onSubmit={async (data) => {
            setSubmitError(null);
            setSubmitting(true);
            try {
              await login(data.email, data.password);
              onClose();
              router.push("/dashboard");
            } catch (e) {
              setSubmitError(e instanceof Error ? e.message : "Sign in failed");
            } finally {
              setSubmitting(false);
            }
          }}
          onSwitch={() => {
            setSubmitError(null);
            setMode("signup");
          }}
        />
      ) : (
        <SignupForm
          submitting={submitting}
          submitError={submitError}
          onSubmit={async (data) => {
            setSubmitError(null);
            setSubmitting(true);
            try {
              await signup({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                company: data.company,
              });
              onClose();
              router.push("/dashboard");
            } catch (e) {
              setSubmitError(e instanceof Error ? e.message : "Sign up failed");
            } finally {
              setSubmitting(false);
            }
          }}
          onSwitch={() => {
            setSubmitError(null);
            setMode("login");
          }}
        />
      )}
    </Modal>
  );
}

// ─── Sub-forms ───────────────────────────────────────────────────────────────

function LoginForm({
  submitting,
  submitError,
  onSubmit,
  onSwitch,
}: {
  submitting: boolean;
  submitError: string | null;
  onSubmit: (data: LoginData) => void;
  onSwitch: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  return (
    <>
      <h2 className="mb-1 text-2xl font-bold text-[#2C3E50]">
        Welcome back
      </h2>
      <p className="mb-6 text-sm text-[#5A6C7D]">
        Sign in to continue auditing invoices.
      </p>

      {submitError && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#F5222D]/8 px-3 py-2 text-sm text-[#cf1322]">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[#5A6C7D] cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#E5EAF0] accent-[#8CC0EB]"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-[#5BA3DC] hover:text-[#2C3E50] transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" loading={submitting} className="w-full mt-2">
          Sign In →
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#5A6C7D]">
        Don&apos;t have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-semibold text-[#5BA3DC] hover:text-[#2C3E50] transition-colors"
        >
          Sign Up
        </button>
      </p>
    </>
  );
}

function SignupForm({
  submitting,
  submitError,
  onSubmit,
  onSwitch,
}: {
  submitting: boolean;
  submitError: string | null;
  onSubmit: (data: SignupData) => void;
  onSwitch: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({ resolver: zodResolver(signupSchema) });

  return (
    <>
      <h2 className="mb-1 text-2xl font-bold text-[#2C3E50]">
        Start your free audit
      </h2>
      <p className="mb-6 text-sm text-[#5A6C7D]">
        No credit card required.
      </p>

      {submitError && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#F5222D]/8 px-3 py-2 text-sm text-[#cf1322]">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <Input
          label="Full Name"
          autoComplete="name"
          placeholder="Priya Sharma"
          {...register("fullName")}
          error={errors.fullName?.message}
        />
        <Input
          label="Work Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          {...register("password")}
          error={errors.password?.message}
        />
        <Input
          label="Company Name"
          autoComplete="organization"
          placeholder="Acme Corp"
          {...register("company")}
          error={errors.company?.message}
        />

        <label className="flex items-start gap-2 text-sm text-[#5A6C7D] cursor-pointer pt-1">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-[#E5EAF0] accent-[#8CC0EB]"
            {...register("agree")}
          />
          <span>
            I agree to the{" "}
            <a className="text-[#5BA3DC] hover:underline">Terms</a> and{" "}
            <a className="text-[#5BA3DC] hover:underline">Privacy Policy</a>.
          </span>
        </label>
        {errors.agree?.message && (
          <p className="-mt-2 text-xs text-[#F5222D]">{errors.agree.message}</p>
        )}

        <Button type="submit" loading={submitting} className="w-full mt-2">
          Create Account →
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#5A6C7D]">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-semibold text-[#5BA3DC] hover:text-[#2C3E50] transition-colors"
        >
          Sign In
        </button>
      </p>
    </>
  );
}
