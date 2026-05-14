"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Bell,
  Building2,
  Lock,
  LogOut,
  Mail,
  Trash2,
  User as UserIcon,
  CheckCircle2,
} from "lucide-react";

import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { useAuditHistoryStore, useAuthStore } from "@/lib/store";

const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  company: z.string().min(1, "Enter your company"),
});

type ProfileData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);
  const clearAudits = useAuditHistoryStore((s) => s.clearAudits);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      company: user?.company ?? "",
    },
  });

  const onSubmit = (data: ProfileData) => {
    updateProfile(data);
    setSaved(true);
    reset(data);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#2C3E50]">Settings</h1>
        <p className="mt-1 text-sm text-[#5A6C7D]">
          Manage your profile, preferences, and account.
        </p>
      </div>

      <Section
        icon={<UserIcon className="h-5 w-5" />}
        title="Profile"
        subtitle="Update your personal information."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Input
            label="Full Name"
            {...register("fullName")}
            error={errors.fullName?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <div className="sm:col-span-2">
            <Input
              label="Company"
              {...register("company")}
              error={errors.company?.message}
            />
          </div>
          <div className="sm:col-span-2 mt-2 flex items-center gap-3">
            <Button type="submit" disabled={!isDirty}>
              Save Changes
            </Button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3a8c12]">
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </span>
            )}
          </div>
        </form>
      </Section>

      <Section
        icon={<Bell className="h-5 w-5" />}
        title="Notifications"
        subtitle="Control what alerts you receive."
      >
        <div className="space-y-4">
          <ToggleRow
            label="Escalation alerts"
            description="Get notified when a violation needs CFO review."
            defaultChecked
          />
          <ToggleRow
            label="Weekly digest"
            description="Summary of compliance activity each Monday."
            defaultChecked
          />
          <ToggleRow
            label="Product updates"
            description="Occasional news on new agent capabilities."
          />
        </div>
      </Section>

      <Section
        icon={<Lock className="h-5 w-5" />}
        title="Security"
        subtitle="Keep your account secure."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <SecurityRow
            icon={<Mail className="h-4 w-4 text-[#5BA3DC]" />}
            title="Email verified"
            status="Verified"
          />
          <SecurityRow
            icon={<Lock className="h-4 w-4 text-[#5BA3DC]" />}
            title="Two-factor auth"
            status="Not enabled"
            action="Enable"
          />
          <SecurityRow
            icon={<Building2 className="h-4 w-4 text-[#5BA3DC]" />}
            title="SSO (SAML)"
            status="Enterprise plan"
          />
        </div>
      </Section>

      <Section
        icon={<Trash2 className="h-5 w-5 text-[#F5222D]" />}
        title="Danger Zone"
        subtitle="These actions are permanent."
        danger
      >
        <div className="space-y-3">
          <DangerRow
            title="Clear audit history"
            description="Delete every locally-cached audit response from this device."
            actionLabel="Clear History"
            onClick={() => {
              if (
                confirm(
                  "Are you sure? This will remove all cached audit results."
                )
              ) {
                clearAudits();
              }
            }}
          />
          <DangerRow
            title="Sign out"
            description="End this session. You can sign back in any time."
            actionLabel="Sign Out"
            icon={<LogOut className="h-4 w-4" />}
            onClick={() => {
              logout();
              router.push("/");
            }}
          />
        </div>
      </Section>
    </div>
  );
}

function Section({
  icon,
  title,
  subtitle,
  children,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      className={`rounded-xl border bg-white p-6 shadow-[0_1px_3px_rgba(44,62,80,0.06)] ${
        danger ? "border-[#F5222D]/20" : "border-[#E5EAF0]"
      }`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`grid h-10 w-10 place-items-center rounded-lg ${
            danger ? "bg-[#F5222D]/10 text-[#F5222D]" : "bg-[#BFDDF0]/40 text-[#5BA3DC]"
          }`}
        >
          {icon}
        </div>
        <div>
          <h2
            className={`text-base font-bold ${
              danger ? "text-[#cf1322]" : "text-[#2C3E50]"
            }`}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#5A6C7D]">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(!!defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-[#E5EAF0] bg-[#F8FAFB]/50 p-4">
      <div>
        <p className="text-sm font-semibold text-[#2C3E50]">{label}</p>
        <p className="mt-0.5 text-xs text-[#5A6C7D]">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => setChecked((v) => !v)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#8CC0EB]" : "bg-[#E5EAF0]"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SecurityRow({
  icon,
  title,
  status,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
  action?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#E5EAF0] bg-[#F8FAFB]/50 p-4">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6C7D]">
        {icon}
        {title}
      </div>
      <p className="text-sm font-medium text-[#2C3E50]">{status}</p>
      {action && (
        <Button variant="ghost" size="sm" className="w-fit">
          {action}
        </Button>
      )}
    </div>
  );
}

function DangerRow({
  title,
  description,
  actionLabel,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-[#F5222D]/15 bg-[#F5222D]/4 p-4 sm:flex-row sm:items-center">
      <div>
        <p className="text-sm font-semibold text-[#2C3E50]">{title}</p>
        <p className="mt-0.5 text-xs text-[#5A6C7D]">{description}</p>
      </div>
      <Button variant="danger" size="sm" onClick={onClick}>
        {icon}
        {actionLabel}
      </Button>
    </div>
  );
}
