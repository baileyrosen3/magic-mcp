"use client" 

import * as React from "react"
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/utils";

export interface PasswordStrengthMeterProps {
  password: string;
  minLength?: number;
  className?: string;
  barClassName?: string;
  criteriaClassName?: string;
  colors?: string[];
  levels?: number;
  customRequirements?: {
    label: string;
    test: (pass: string) => boolean;
  }[];
}

export function PasswordStrengthMeter({
  password,
  minLength = 8,
  className,
  barClassName,
  criteriaClassName,
  colors = ["#dc2626", "#ea580c", "#16a34a", "#15803d"],
  levels = 4,
  customRequirements,
}: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0);
  const [requirementsMet, setRequirementsMet] = useState<boolean[]>([]);

  const defaultRequirements = useMemo(
    () => [
      {
        label: `At least ${minLength} characters`,
        test: (pass: string) => pass.length >= minLength,
      },
      {
        label: "Contains uppercase letter",
        test: (pass: string) => /[A-Z]/.test(pass),
      },
      {
        label: "Contains number",
        test: (pass: string) => /[0-9]/.test(pass),
      },
      {
        label: "Contains special character",
        test: (pass: string) => /[^A-Za-z0-9]/.test(pass),
      },
    ],
    [minLength]
  );

  const requirements = customRequirements ?? defaultRequirements;

  useEffect(() => {
    const met = requirements.map((req) => req.test(password));
    setRequirementsMet(met);

    const metCount = met.filter(Boolean).length;
    const level = Math.min(
      Math.floor((metCount / requirements.length) * levels),
      levels
    );
    setStrength(level);
  }, [password, requirements, levels]);

  return (
    <div
      className={cn("space-y-3", className)}
      role="region"
      aria-label="Password strength meter"
    >
      {/* Strength Bar */}
      <div className={cn("flex gap-1", barClassName)}>
        {Array.from({ length: levels }).map((_, i) => (
          <div
            key={i}
            className="h-2 flex-1 rounded-full bg-muted transition-all"
            style={{
              backgroundColor:
                i < strength ? colors[strength - 1] : "#00000010",
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Criteria List */}
      <div
        className={cn("text-sm text-muted-foreground pt-2", criteriaClassName)}
      >
        {requirements.map((req, i) => (
          <div
            key={req.label}
            className={cn(
              "flex items-center gap-2",
              requirementsMet[i] && "text-green-600"
            )}
          >
            <span className="text-xs">•</span>
            {req.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export const PasswordStrengthMeterExample: React.FC = () => {
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col gap-4 max-w-xl w-full bg-background border border-primary/10 p-4 rounded-3xl shadow-2xl/10">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border rounded-xl focus:outline-fd-foreground/30"
        placeholder="Enter your password"
      />
      <PasswordStrengthMeter password={password} />
    </div>
  );
};
